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

//get booking sales stats => api/admin/sales_stats
export const getSalesStats = catchAsyncErrors(
  async(req : NextRequest) => {
    const {searchParams} = new URL(req.url)

    const startDate = new Date(searchParams.get('startDate') as string)
    const endDate = new Date(searchParams.get('endDate') as string)
    //set the time to get the complete day
    startDate.setHours(0,0,0,0)
    endDate.setHours(29,59,59,999)

    const bookings = await Booking.find({
      createdAt : {$gte : startDate, $lte : endDate}
    })
    const numOfBookings = bookings.length
    const totalSales = bookings.reduce((acc, booking) => 
      acc + booking.amountPaid, 0
    )
    const sixMonthsData = await getLastSixMonthSales()
    const topRooms = await getTopPerfomingRooms(startDate, endDate)

    return NextResponse.json({
      numOfBookings,
      totalSales,
      sixMonthsData,
      topRooms
    })
  }
)

const getLastSixMonthSales = async () => {
  const last6MonthsSales : any = []
  //Get current date
  const currentDate = moment()
  //get sales for one month
  async function fetchSalesForOneMonth(startDate : moment.Moment, endDate : moment.Moment) {
    const results = await Booking.aggregate([
      //stage 1 : filter the data
      {
        $match : {
          createdAt : {$gte : startDate.toDate(), $lte : endDate.toDate()}
        }
      },
      //stage 2 : group the data
      {
        $group : {
          _id : null,
          totalSales : {$sum : "$amountPaid"},
          numOfBookings : {$sum : 1}
        }
      }
    ])

    const {totalSales, numOfBookings} = results?.length > 0 ? results[0] : {totalSales : 0, numOfBookings : 0}

    last6MonthsSales.push({
      monthName : startDate.format("MMMM"),
      totalSales,
      numOfBookings
    })
  }

  for (let i = 0 ; i < 6; i++){
    const startDate = moment(currentDate).startOf('month')
    const endDate = moment(currentDate).endOf('month')

    await fetchSalesForOneMonth(startDate, endDate)
    currentDate.subtract(1, 'month')
  }

  return last6MonthsSales
}

const getTopPerfomingRooms = async (startDate : Date, endDate : Date) => {
  const topRooms = await Booking.aggregate([
    //stage 1 : Filter documents within the given date range
    {
      $match : {
        createdAt : {$gte : startDate, $lte : endDate}
      }
    },
    //stage 2 : group documents by room
    {
      $group : {
        _id : "$room",
        bookingsCount : {$sum : 1}
      }
    },
    //stage 3 : sort documents by  booking count in descending order
    {
      $sort : {bookingsCount : -1}
    },
    //stage 4 : get the top 3 (limit the documents)
    {
      $limit : 3
    },
    //Stage 5 : Retrieve additional data from rooms collection
    {
      $lookup : {
        from : 'rooms',
        localField : "_id",
        foreignField : '_id',
        as : "roomData"
      }
    }, 
    //stage 6 : Takes roomData and reconstructs into documents
    {
      $unwind : '$roomData'
    },
    //stage 7 : Shape the output document(include or exclude the fields)
    {
      $project : {
        _id : 0,
        roomName : "$roomData.name",
        bookingsCount : 1
      }
    }
  ])

  return topRooms
}