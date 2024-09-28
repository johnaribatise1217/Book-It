import { NextRequest, NextResponse } from "next/server";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import Booking, { IBooking } from "../models/bookings";
import Moment from "moment";
import { extendMoment } from "moment-range";
import ErrorHandler from "../utils/errorHandler";
import { cookies } from "next/headers";

const moment = extendMoment(Moment)

//end point to create new booking => /api/bookings
export const newBooking = catchAsyncErrors(
  async(req : NextRequest) => {
    const body = await req.json()

    //destructure body properties
    const {room , checkInDate, checkOutDate, daysOfStay, amountPaid, paymentInfo} = body

    const booking = Booking.create({
      room,
      user : req.user?._id,
      checkInDate, checkOutDate, daysOfStay, amountPaid, paymentInfo,
      paidAt : Date.now()
    })

    return NextResponse.json({
      success : true,
      booking
    })
  }
)

//end point to check room availability => /api/bookings/check_available_rooms?{searchParams}
export const checkRoomBookingAvailabillity = catchAsyncErrors(
  async(req : NextRequest) => {
    const {searchParams} = new URL(req.url)
    const roomId = searchParams.get("roomId")
    const checkInDate : Date = new Date(searchParams.get("checkInDate") as string)
    const checkOutDate : Date = new Date(searchParams.get("checkOutDate") as string)

    const bookings : IBooking[] = await Booking.find({
      room : roomId,
      $and : [
        //checkInDate should be less than or equals to checkOutDate and reverse vice versa
        {checkInDate : {$lte : checkOutDate}},
        {checkOutDate : {$gte : checkInDate}},
      ]
    })

    const isAvailable : boolean = bookings.length === 0

    return NextResponse.json({
      isAvailable
    })
  }
)

//end point to get all booked dates => api/bookings/booked_dates?roomId={id}
export const getRoomBookedDates = catchAsyncErrors(
  async(req : NextRequest) => {
    const {searchParams} = new URL(req.url)
    const roomId = searchParams.get("roomId")

    const bookings = await Booking.find({room : roomId})
    const bookedDates = bookings.flatMap((booking) => 
      Array.from(
        moment.range(moment(booking.checkInDate), moment(booking.checkOutDate)).by('day')
      )
    )

    return NextResponse.json({
      bookedDates
    })
  }
)

//end point to get current user bookings => api/bookings/me
export const myBookings = catchAsyncErrors(
  async(req : NextRequest) => {
    const bookings = await Booking.find({
      user : req.user?._id
    })

    console.log(cookies().getAll())

    return NextResponse.json({
      bookings
    })
  }
)

//end point to get booking details => api/bookings/me:id
export const getBookingDetails = catchAsyncErrors(
  async(req : NextRequest,
    {params} : {params : {id : string}}
  ) => {
    const booking = await Booking.findById(params.id).populate('user room')

    if(booking.user?._id?.toString() !== req.user._id) {
      throw new ErrorHandler("You cannot view this booking.", 403)
    }

    return NextResponse.json({
      booking
    })
  }
)