import React, { useEffect, useState } from "react";
import {useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {getCurrentBookings, editYourBooking} from '../../store/bookings'

function EditBooking({bookingId}) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [errors, setErrors] = useState([])

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

    useEffect(() => {
        dispatch(getCurrentBookings())
    }, [dispatch])

    const bookings = useSelector(state => state?.bookings?.bookings)
    const currentBooking = bookings[bookingId]
    const [startDate, setStartDate] = useState(currentBooking.startDate)
    const [endDate, setEndDate] = useState(currentBooking.endDate)

    if(!currentBooking) return null


    const handleSubmit = async (e) => {
        e.preventDefault()
        const bookingDetails = {
            startDate,
            endDate
        }
        const editedBooking = await dispatch(editYourBooking(bookingId, bookingDetails)).catch(
            async (res) => {
              const data = await res.json()
              if(data && data.errors) setErrors(data.errors)
            }
        )

        if(editedBooking) {
            setTimeout(() => window.location.reload(true), 1);
            history.push('/trips')
        }
    }

  return (
    <>
                 <form  onSubmit={handleSubmit} method="post" id='booking-form'>

                    <div id='edit-booking-errors'>
                        {errors.map((error, idx) => (
                            <div key={idx}>{error}</div>
                        ))}
                    </div>
                    <div>CHECK-IN</div>
                     <input
                     type='date'
                     required
                     onChange={(e) => setStartDate(e.target.value)}
                     value={startDate}
                     className='date-inputs'
                     min={getCurrentDate()}
                     />

                     <div> CHECK-OUT</div>
                     <input
                     required
                     type='date'
                     onChange={(e) => setEndDate(e.target.value)}
                     value={endDate}
                     className='date-inputs'
                     min={startDate || getCurrentDate()}
                     />
                    <button type='submit' id='booking-submit-button'> Reserve</button>

                </form>
    </>
  );
}

export default EditBooking
