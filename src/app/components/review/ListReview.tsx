import React from 'react'
import { IReviews } from '../../../../backend/models/rooms'
import StarRatings from 'react-star-ratings'

interface Props {
  reviews : IReviews[]
}
const ListReview = ({reviews} : Props) => {
  let message : string = ''
  const showReview = (len : number) => {
    if(len < 1){
      message = 'No reviews on this room yet'
    } else if(len == 1){
      message = `${len} review`
    } else {
      message = `${len} reviews`
    }

    return message
  }

  return (
    <>
      <div className="reviews w-75 mb-5">
        <h3>{showReview(reviews?.length)}</h3>
        <hr />

        {
          reviews?.map((review) => (
            <div className="review-card my-3">
              <div className="row">
                <div className="col-3 col-lg-1">
                  <img
                    src={
                      review?.user?.avatar ? review?.user?.avatar?.url : '/imgaes/default_avatar.png'
                    }
                    alt={review?.user?.name}
                    width="60"
                    height="60"
                    className="rounded-circle"
                  />
                </div>
                <div className="col-9 col-lg-11">
                  <StarRatings
                    rating={review?.rating}
                    starRatedColor="#e61e4d"
                    starDimension='22px'
                    starSpacing='1.2px'
                    numberOfStars={5}
                    name='rating'
                  />
                  <p className="review_user mt-1">{review?.user?.name}</p>
                  <p className="review_comment">
                   {review?.comment}
                  </p>
                </div>
                <hr />
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default ListReview