'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { usePostReviewMutation } from '../../../../redux/api/roomApi'
import toast from 'react-hot-toast'
import StarRatings from 'react-star-ratings'

const NewReview = ({roomId} : {roomId : string}) => {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  
  const router = useRouter()

  const [postReview, {error,isSuccess}] = usePostReviewMutation()

  useEffect(() => {
    if(error && 'data' in error){
      toast.error(error?.data?.errMessage)
    }

    if(isSuccess){
      toast.success("Review Posted")
      router.refresh()
    }
  }, [error, isSuccess])

  const submitHandler = () => {
    const reviewData = {rating, comment, roomId}
    postReview(reviewData)
  }

  return (
    <>
      <div
        className="modal fade"
        id="ratingModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="ratingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
                <StarRatings
                  rating={rating}
                  starRatedColor="#e61e4d"
                  starDimension='18px'
                  starSpacing='1.2px'
                  numberOfStars={6}
                  name='rating'
                  changeRating={(e : any) => setRating(e)}
                />
                <div className="form-floating">
                  <textarea 
                  name="review_field"
                  cols={30}
                  rows={10}
                  placeholder='leave your review'
                  style={{height : "100px"}}
                  onChange={(e) => setComment(e.target.value)}
                  id="" 
                  className="form-control mt-4"/>
                  <label htmlFor="review_field">Comment</label>
                </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn bg-danger text-white my-3 form-btn w-100"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={submitHandler}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewReview