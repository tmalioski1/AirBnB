import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';
import {getCurrentBookings, deleteYourBooking} from '../../store/bookings'
import EditBooking from './EditBooking'
import './index.css'

function Bookings() {
const sessionUser = useSelector(state => state?.session?.user);
console.log('this is the sessionUser---', sessionUser)
const bookingsObj = useSelector(state =>state?.bookings?.bookings)
const bookings = Object.values(bookingsObj)
const dispatch = useDispatch();
const history = useHistory();
const [selectedBookingId, setSelectedBookingId] = useState(null);
const [userKey, setUserKey] = useState(sessionUser.id);



useEffect(() => {
  dispatch(getCurrentBookings())
  document.title = 'Your Trips'
  const hasNonMatchingBooking = bookings.some(booking => booking.userId !== sessionUser.id);
  if (hasNonMatchingBooking) {
    // Refresh the page if there is any non-matching booking
    history.go(0);
  }
}, [dispatch, sessionUser.id, history])

useEffect(() => {
  setUserKey(sessionUser?.id || null);
}, [sessionUser]);

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
  } else if (startYear === endYear && startYear !== currentYear) {
    let formattedStartDate = `${startMonth} ${startDay}`;
    let formattedEndDate = `${startMonth} ${endDay}, ${startYear}`;
    return `${formattedStartDate} - ${formattedEndDate}`;
  } else {
    let formattedDate = `${startMonth} ${startDay}`;

    if (startYear !== currentYear) {
      formattedDate += `, ${startYear}`;
    }

    formattedDate += ` - ${endMonth} ${endDay}`;

    if (endYear !== currentYear) {
      formattedDate += `, ${endYear}`;
    }

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

const handleEditBooking = (id) => {
  if (selectedBookingId === id) {
    setSelectedBookingId(null);
  } else {
    setSelectedBookingId(id);
  }
};

     return (
    <div className= 'trips-container' key={userKey}>
   <h1 className='trips-header'>Trips</h1>
   <div className='bookings-container'>
   {(currentBookings.length === 0 && futureBookings.length === 0) ? (

    <div className='no-trips-container'>
    <div className='no-trips-container-info'>
    <div className="no-booking-line1">No trips booked...yet!</div>
    <div className="no-booking-line2">
      Time to dust off your bags and start planning your <br></br>next adventure
    </div>
    <button className='start-searching' onClick={() => history.push("/")}>Start Searching</button>
    </div>
    <div className='no-trips-pic-container'>
    <img className='no-trips-pic' src='https://a0.muscache.com/im/pictures/d727f355-3f10-44b5-9750-d1efca2438fc.jpg?im_w=1200'></img>
    </div>
  </div>
        ) : (
          <>
   {currentBookings.length !== 0 &&
    <div className='current-trips-container'>
      <h2>{currentBookings.length === 1 ? 'Your current booking - enjoy!' : 'Your current bookings - enjoy!'}</h2>
      <div className='trip-array'>
      {currentBookings.map(booking => (
        <div key={booking.id} className='individual-booking'>
        <NavLink to={`/spots/${booking?.Spot?.id}`}>
        <img className='booking-image' src={booking?.Spot?.previewImage}></img>
        </NavLink>
        <div className='booking-city-dates'>
        <NavLink to={`/spots/${booking?.Spot?.id}`}>
        <div className='booking-city'>{booking?.Spot?.city}</div>
        <div className='booking-dates'>{formatDate(booking?.startDate, booking?.endDate)}</div>
        </NavLink>
        </div>
        </div>
      ))}
      </div>
    </div>
    }
    {futureBookings.length !== 0 &&
    <div className='upcoming-trips-container'>
      <h2>Your upcoming bookings</h2>
      <div className='trip-array'>
      {futureBookings.map(booking => (
        <div key={booking.id} className='individual-booking-upcoming-extra'>
        <div className='individual-booking'>
        <NavLink to={`/spots/${booking?.Spot?.id}`}>
        <img className='booking-image' src={booking?.Spot?.previewImage}></img>
        </NavLink>
        <div className='booking-city-dates'>
        <NavLink to={`/spots/${booking?.Spot?.id}`}>
        <div className='booking-city'>{booking?.Spot?.city}</div>
        <div className='booking-dates'>{formatDate(booking?.startDate, booking?.endDate)}</div>
        </NavLink>
        </div>
        </div>
        <div className='future-extras'>
      <button onClick={() => handleEditBooking(booking?.id)} className='edit-booking-button'>
        {selectedBookingId === booking?.id ? 'Close' : 'Change the Dates'}
      </button>
      {selectedBookingId === booking?.id && <EditBooking bookingId={booking?.id} />}
      <button onClick={() => handleDeletion(booking?.id)} className='cancel-booking'>Cancel Trip</button>
    </div>
         </div>

      ))}
    </div>
    </div>
    }
           </>
        )}
    {prevBookings.length !== 0 &&
    <div className='previous-trips-container'>
    <h2 className='where-you-been'>Where you've been</h2>
    <div className='trip-array'>
    {prevBookings.map(booking => (
    <div key={booking.id} className='individual-booking'>
      <NavLink to={`/spots/${booking?.Spot?.id}`}>
    <img className='booking-image' src={booking?.Spot?.previewImage}></img>
    </NavLink>
    <div className='booking-city-dates'>
        <NavLink to={`/spots/${booking?.Spot?.id}`}>
    <div className='booking-city'>{booking?.Spot?.city}</div>
    <div className='booking-dates'>{formatDate(booking?.startDate, booking?.endDate)}</div>
    </NavLink>
        </div>
    </div>
    ))}
   </div>
   </div>
}
   </div>
   </div>

     );
   }

   export default Bookings
