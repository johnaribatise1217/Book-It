import { NextRequest, NextResponse } from "next/server";
import Room, { IReviews, IRoom } from "../models/rooms";
import ErrorHandler from "../utils/errorHandler";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ApiFilters from "../utils/ApiFilters";
import { URL } from "url";
import Booking, { IBooking } from "../models/bookings";

export const allRooms = catchAsyncErrors(
  async(request : NextRequest) => {
    const resPerPage : number = 4
    // const rooms = await Room.find()

    const {searchParams} = new URL(request.url)
    console.log(searchParams)

    const queryStr : any = {}

    searchParams.forEach((value, key) => {
      queryStr[key] = value
    })

    const apiFilters = new ApiFilters(Room, queryStr).search().Filter()

    let rooms : IRoom[] = await apiFilters.query
    const filteredRoomsCount : number = rooms.length

    apiFilters.Pagination(resPerPage)
    rooms = await apiFilters.query.clone()
  
    return NextResponse.json({
      success : true,
      filteredRoomsCount,
      resPerPage,
      rooms
    })
  }
)

//post a new room => api/admin/rooms
export const newRoom = catchAsyncErrors(
  async(req : NextRequest) => {
    const body = await req.json()
  
    const room = Room.create(body)
  
    return NextResponse.json({
      success : true,
      room
    })
  }
) 

//get room by id => api/rooms/:id
export const getRoomDetails = catchAsyncErrors(
  async(req : NextRequest, {params} : {params : {id : string}}) => {
    const room = await Room.findById(params.id).populate('reviews.user')

    if(!room){
      throw new ErrorHandler("Room not found", 404)
    }

    return NextResponse.json({ 
      success : true,
      room
    }) 
  }
)

//update a room => api/admin/rooms/:id
export const updateRoomDetails = catchAsyncErrors(
  async (
    req : NextRequest,
    {params} : {params : {id : string}}
  ) =>{
    //we have to find the room by the id
    let room = await Room.findById(params.id)
    const body = await req.json()
  
    if(!room){
      throw new ErrorHandler("Room not found", 404)
    }
  
    room = await Room.findByIdAndUpdate(params.id, body , {
      new : true
    })
  
    return NextResponse.json({
      success : true,
      room
    })
  }
)

export const deleteRoom = catchAsyncErrors(
  async (
    req : NextRequest,
    {params} : {params : {id : string}}
  ) =>{
    //we have to find the room by the id
    const room = await Room.findById(params.id)
  
    if(!room){
      throw new ErrorHandler("Room not found", 404) 
    }
  
    await room.deleteOne()
  
    return NextResponse.json({
      success : true,
    })
  }
)

//create a review => api/reviews
export const createRoomReview = catchAsyncErrors(
  async(
    req: NextRequest
  ) => {
    const body = await req.json()
    const {rating, comment, roomId} = body

    const review = {
      user : req.user?._id,
      rating : Number(rating),
      comment
    }

    const room = await Room.findById(roomId)

    //check if a user has given a review
    const isReviewed = room?.reviews?.find(
      (r : IReviews) => r.user?.toString() === req?.user?._id?.toString()
    )

    if(isReviewed){
      room?.reviews?.forEach((review : IReviews) => {
        if(review?.user?.toString() === req?.user?._id?.toString()){
          //update that user review
          review.comment = comment
          review.rating = rating 
        }
      })
    } else {
      room.reviews.push(review)
      room.numOfReviews = room.reviews.length
    }

    room.ratings = room?.reviews?.reduce(
      (acc : number, item : {rating : number}) => item.rating + acc,
      0
    ) / room?.reviews?.length

    await room.save()
     
    return NextResponse.json({
      success : true
    })
  }
)

//can user review room (basically a user has to have booked and paid for the room)
// => api/reviews/can_review
export const canUserReviewRoom = catchAsyncErrors(
  async(req : NextRequest) => {
    const {searchParams} = new URL(req.url)
    const roomId = searchParams.get('roomId');

    const booking = await Booking.find({user : req?.user?._id, room : roomId});

    const canReview : boolean = booking?.length > 0 ? true : false
    return NextResponse.json({
      canReview
    })
  }
)