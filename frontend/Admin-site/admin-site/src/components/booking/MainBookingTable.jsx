import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { fetchBooking } from '../../redux/action/booking.action'
import BookingTable from './BookingTable'
import PageHeading from '../common/PageHeading'
const ManiBookingTable = () => {

    const dispatch=useDispatch()
    const {booking, isLoading, errorMsg}=useSelector((state)=>state.booking)
   
    useEffect(() => {
      dispatch(fetchBooking())
      
    
    }, [dispatch])
    console.log(booking);
    
    
  return (
    <div className="admin-list-page">
        <PageHeading
          eyebrow="Reservations"
          title="Bookings"
          description="Review reservation details and stay activity."
        />
        <div className="overflow-x-auto">
          <BookingTable 
          booking={booking} 
          isLoading={isLoading}
          errorMsg={errorMsg} 
          />
          </div>
    </div>
  )
}

export default ManiBookingTable