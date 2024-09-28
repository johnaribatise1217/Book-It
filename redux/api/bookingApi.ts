import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath : "bookingApi",
  baseQuery : fetchBaseQuery({baseUrl : "/api"}),
  endpoints : (builder) => ({
    newBooking : builder.mutation({
      query(body) {
        return {
          url : "/bookings",
          method : "POST",
          body
        }
      }
    }),
    checkBookingAvailability : builder.query({
      query({id, checkInDate, checkOutDate}) {
        return {
          url : `/bookings/check_available_rooms?roomId=${id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
        }
      }
    }),
    getRoomBookedDates : builder.query({
      query(id) {
        return {
          url : `/bookings/booked_dates?roomId=${id}`,
        }
      }
    }),
    stripeCheckout : builder.query({
      query({id, checkOutData}) {
        return {
          url : `/payment/checkout-session/${id}`,
          params : {
            checkInDate : checkOutData.checkInDate,
            checkOutDate : checkOutData.checkOutDate,
            daysOfStay : checkOutData.daysOfStay,
            amountPaid : checkOutData.amountPaid
          }
        }
      }
    })
  })
})

export const {useNewBookingMutation, useLazyCheckBookingAvailabilityQuery, useGetRoomBookedDatesQuery, useLazyStripeCheckoutQuery} = bookingApi