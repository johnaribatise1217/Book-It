import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-datepicker/dist/react-datepicker.css'
import { IRoom } from '../../../../backend/models/rooms'
import { useGetRoomBookedDatesQuery, useLazyCheckBookingAvailabilityQuery, useLazyStripeCheckoutQuery} from '../../../../redux/api/bookingApi'
import { calculateDaysOfStay } from '../../../../helpers/helper'
import toast from 'react-hot-toast'
import { useAppSelector } from '../../../../redux/hooks'
import { useRouter } from 'next/navigation'

interface Props {
  room : IRoom
}

const BookingDatePicker = ({room} : Props) => {
  const [checkInDate, setCheckInDate] = useState(new Date())
  const [checkOutDate, setCheckOutDate] = useState(new Date())
  const [daysOfStay, setDaysOfStay] = useState(0)
  const router = useRouter()

  const {isAuthenticated} = useAppSelector((state) => state.auth)

  const [checkBookingAvailability, {data}] = useLazyCheckBookingAvailabilityQuery()
  const isAvailable = data?.isAvailable

  const {data : {bookedDates : dates} = {}} = useGetRoomBookedDatesQuery(room._id)
  const excludeDates = dates?.map((date : string) => new Date(date) || [])

  const dateOnChange = (dates : Date[]) => {
    const [checkInDate , checkOutDate] = dates

    setCheckInDate(checkInDate)
    setCheckOutDate(checkOutDate)

    if(checkInDate && checkOutDate){
      const days = calculateDaysOfStay(checkInDate, checkOutDate)
      setDaysOfStay(days)
      //check booking availability
      checkBookingAvailability({
        id : room._id,
        checkInDate : checkInDate.toISOString(),
        checkOutDate : checkOutDate.toISOString()
      })
    }
  }

  const [stripeCheckout, {error , isLoading, data : checkOutData}] = useLazyStripeCheckoutQuery()

  useEffect(() => {
    if(error && 'data' in error){
      toast.error(error?.data?.errMessage)
    }
  
    if(checkOutData){
      router.replace(checkOutData?.url)
    }
  }, [error, checkOutData])

  const bookRoom = () => {
    const amountPaid = room.pricePerNight * daysOfStay
    const checkOutData = {
      checkInDate : checkInDate.toISOString(),
      checkOutDate : checkOutDate.toISOString(),
      daysOfStay,
      amountPaid
    }

    stripeCheckout({id : room?._id, checkOutData})
  }

  // const bookRoom = () => {
  //   const bookingData = {
  //     checkInDate, 
  //     checkOutDate, 
  //     daysOfStay, 
  //     amountPaid : room.pricePerNight * daysOfStay,
  //     paymentInfo : {
  //       id: 'STRIPE_ID',
  //       status: 'PAID'
  //     },
  //     room : room?._id
  //   }
    
  //   newBooking(bookingData)
  // }

  return (
    <div className="booking-card shadow p-4">
      <p className="price-per-night">
        <b>${room?.pricePerNight}</b> / night
      </p>
      <hr />
      <p className="mt-5 mb-3">Pick Check In & Check Out Date</p>

      <DatePicker className='w-100' 
        selected={checkInDate}
        startDate={checkInDate}
        endDate={checkOutDate}
        onChange={dateOnChange}
        excludeDates={excludeDates}
        minDate={new Date()}
        selectsRange
        inline
      />
      {isAvailable === true &&(
        <div className="alert alert-success my-3">
          Room is available. Book now
        </div>
      )}
      {isAvailable === false &&(
        <div className="alert alert-danger my-3">
          Room not available. Try different date range.
        </div>
      )}
      {isAvailable && !isAuthenticated &&(
        <div className="alert alert-danger my-3">
          Login to book room
        </div>
      )}
      {isAvailable && isAuthenticated &&(
        <button className="btn btn-danger py-3 form-btn cursor-pointer w-100"
          onClick={bookRoom}
          disabled={isLoading}
        >
          PAY - ${daysOfStay * room?.pricePerNight}
        </button>
      )}
    </div>
  )
}

export default BookingDatePicker