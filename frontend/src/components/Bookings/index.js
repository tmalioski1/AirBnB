import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';
import {getCurrentBookings, deleteYourBooking} from '../../store/bookings'

function Bookings() {
const bookingsObj = useSelector(state =>state?.bookings?.bookings)
const bookings = Object.values(bookingsObj)
const dispatch = useDispatch();
const history = useHistory();
const [isLoading, setIsLoading] = useState(true)
const [errors, setErrors] = useState([])




useEffect(() => {
  dispatch(getCurrentBookings()).then(() => setIsLoading(false))
  document.title = 'Your Trips'
}, [dispatch])

const prevBookings = bookings.filter(booking => {
  const currentDate = new Date();
  const endDate = new Date(booking?.endDate)
  return endDate < currentDate
})


const currentBookings = bookings.filter(booking => {
  const currentDate = new Date();
  const startDate = new Date(booking?.startDate);
  const endDate = new Date(booking?.endDate);

  return startDate <= currentDate && endDate >= currentDate;
});

const futureBookings = bookings.filter(booking => {
  const currentDate = new Date();
  const startDate = new Date(booking?.startDate);
  return startDate > currentDate;
});

function formatDate(startDateValue, endDateValue) {
  const startDate = new Date(startDateValue);
  const endDate = new Date(endDateValue);

  const startYear = startDate.getFullYear();
  const startMonth = startDate.toLocaleString('default', { month: 'short' });
  const startDay = startDate.toLocaleString('default', { day: '2-digit' });

  const endYear = endDate.getFullYear();
  const endMonth = endDate.toLocaleString('default', { month: 'short' });
  const endDay = endDate.toLocaleString('default', { day: '2-digit' });
  const currentYear = new Date().getFullYear();

  if (startYear !== endYear || startYear !== currentYear) {
    let formattedStartDate = `${startMonth} ${startDay}, ${startYear}`;



    let formattedEndDate = `${endMonth} ${endDay}`;
    if (endYear !== currentYear) {
      formattedEndDate += `, ${endYear}`;
    }

    return `${formattedStartDate} - ${formattedEndDate}`;
  } else if (startYear === endYear && startYear !==currentYear) {
    let formattedStartDate = `${startMonth} ${startDay}`;
    let formattedEndDate = `${startMonth} ${startDay}, ${startYear}`;
    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  else {
    let formattedDate = `${startMonth} ${startDay}`;
    if (startYear !== currentYear) {
      formattedDate += `, ${startYear}`;
    }
    formattedDate += ` - ${endDay}`;
    return formattedDate;
  }
}
const handleDeletion = async (id) => {
  try {
    const response = await dispatch(deleteYourBooking(id));

    if (response && response.statusCode === 200) {
      history.push('/trips');
      alert('Canceled Successfully!');
    } else {
      throw new Error(response?.message || 'An error occurred while canceling the booking');
    }
  } catch (error) {
    if (error.message === "Bookings that have been started can't be deleted") {
      alert(error.message);
    } else {
      alert('Bookings that have been started can\'t be deleted');
    }
  }
};



     return (
      <>
   <h1>Trips</h1>
   <div className='bookings-container'>
   {(currentBookings.length === 0 && futureBookings.length === 0) ? (
    <>
    <div className="no-booking-line1">No trips booked...yet!</div>
    <div className="no-booking-line">
      Time to dust off your bags and start planning your next adventure
    </div>
    <button onClick={() => history.push("/")}>Start Searching</button>
  </>
        ) : (
          <>
   {currentBookings.length !== 0 &&
    <div className='current-trips-container'>
      <p>Your current bookings- enjoy!</p>
      {currentBookings.map(booking => (
        <div className='individual-booking'>
        <NavLink to={`/spots/${booking?.Spot?.id}`}>
        <img className='booking-image' src={booking?.Spot?.previewImage}></img>
        <div className='city-state'>{booking?.Spot?.city}, {booking?.Spot?.state}</div>
        <div className='booking-dates'>{formatDate(booking?.startDate, booking?.endDate)}</div>
        </NavLink>
        </div>
      ))}
    </div>
    }
    {futureBookings.length !== 0 &&
    <div className='upcoming-trips-container'>
      <h1>Your upcoming bookings</h1>
      {futureBookings.map(booking => (
        <div className='individual-booking'>
        <NavLink to={`/spots/${booking?.Spot?.id}`}>
        <img className='booking-image' src={booking?.Spot?.previewImage}></img>
        <div className='city-state'>{booking?.Spot?.city}, {booking?.Spot?.state}</div>
        <div className='booking-dates'>{formatDate(booking?.startDate, booking?.endDate)}</div>
        </NavLink>
        <button>Change the Dates</button>
        <button onClick={() => handleDeletion(booking?.id)} className='cancel-booking'>Cancel Trip</button>
        </div>
      ))}
    </div>
    }
           </>
        )}
    {prevBookings.length !== 0 &&
    <div className='previous-trips-container'>
    <h1 className='where-you-been'>Where you've been</h1>
    {prevBookings.map(booking => (
    <div className='individual-prev-booking'>
      <NavLink to={`/spots/${booking?.Spot?.id}`}>
    <img className='prev-booking-image' src={booking?.Spot?.previewImage}></img>
    <div className='prev-booking-dates'>{formatDate(booking?.startDate, booking?.endDate)}</div>
    </NavLink>
    </div>
    ))}
   </div>
}
   </div>
   </>
     );
   }

   export default Bookings
