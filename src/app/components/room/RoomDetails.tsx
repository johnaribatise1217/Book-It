'use client'
import React from 'react'
import StarRatings from 'react-star-ratings'
import { IRoom } from '../../../../backend/models/rooms'
import RoomImagesSlider from './RoomImagesSlider'
import RoomFeatures from './RoomFeatures'
import BookingDatePicker from './BookingDatePicker'
import NewReview from '../review/NewReview'
import ListReview from '../review/ListReview'
import { useCanUserReviewQuery } from '../../../../redux/api/roomApi'

interface Props{
  data : {
    room : IRoom
  }
}

const RoomDetails = ({data} : Props) => {
  const {room} = data
  const {data : {canReview} = {}} = useCanUserReviewQuery(room?._id)
  return (
    <div className="container container-fluid mx-auto">
      <h2 className="mt-5">{room?.name}</h2>
      <p>{room?.address}</p>

      <div className="ratings mt-auto mb-3">
        <StarRatings
          rating={room?.ratings}
          starRatedColor="#e61e4d"
          starDimension='22px'
          starSpacing='1.2px'
          numberOfStars={6}
          name='rating'
        />
        <span className='no-of-reviews'>({room?.numOfReviews}) Reviews</span>
      </div>

      <RoomImagesSlider images={room?.images}/>

      <div className="row my-5">
        <div className="col-12 col-md-6 col-lg-8">
          <h3>Description</h3>
          <p>
            {room?.description}
          </p>
          <RoomFeatures room={room}/>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <BookingDatePicker room={room}/>
          //ROOM MAP TO BE DONE LATER
        </div>
      </div>
      {canReview && 
        <button
          type="button"
          className="btn btn-danger text-white form-btn mt-4 mb-5"
          data-bs-toggle="modal"
          data-bs-target="#ratingModal"
        >
          Submit Your Review
        </button>
      }
      <NewReview roomId={room?._id}/>
      <ListReview reviews={room?.reviews}/>
    </div>
  )
}

export default RoomDetails;