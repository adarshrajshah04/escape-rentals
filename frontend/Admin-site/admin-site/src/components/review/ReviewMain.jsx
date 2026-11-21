import React, { useEffect } from 'react'
import { fetchReview } from '../../redux/action/review.action'
import { useDispatch, useSelector } from 'react-redux'
import ReviewTable from './ReviewTable'
import PageHeading from '../common/PageHeading'


const ReviewMain = () => {
    const dispatch=useDispatch()
    const {reviews, isLoading, errorMsg}=useSelector((state)=>state.reviews)
    useEffect(() => {
          dispatch(fetchReview())
          
        
        }, [dispatch])
  return (
    <div className="admin-list-page">
         <PageHeading
           eyebrow="Feedback"
           title="Reviews"
           description="Explore guest feedback and property ratings."
         />
         <div className="overflow-x-auto">
        <div>
          <ReviewTable 
          reviews={reviews} 
          isLoading={isLoading}
          errorMsg={errorMsg} 
          />
          </div>
       
    </div>
    </div>
  )
}

export default ReviewMain