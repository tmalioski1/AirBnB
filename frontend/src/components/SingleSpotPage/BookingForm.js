import { makeNewBooking } from "../../store/bookings"
import { useHistory } from 'react-router-dom';
import {useState} from 'react'
import { useDispatch } from 'react-redux';
import './BookingForm.css'

function BookingForm({spotsObj, spotId}) {

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()

   const handleSubmit = async (e) => {

    const bookingDetails = {
        startDate,
        endDate
    }



    let newBooking = await dispatch(makeNewBooking(spotId, bookingDetails))
    if(newBooking){
        history.push('/bookings')
    }
    else {
      console.log('did not work')
    }
}

    return (
      <>
        <form onSubmit={handleSubmit} className="booking-form">
        <div id='title-booking'>Start your experience!</div>
                    <div id='pricePerNight'>${spotsObj.price} night</div>
                    <div>CHECK-IN</div>
                     <input
                     type='date'
                     required
                     onChange={(e) => setStartDate(e.target.value)}
                     value={startDate}
                     className='date-form'
                     />

                     <div> CHECK-OUT</div>
                     <input
                     required
                     type='date'
                     onChange={(e) => setEndDate(e.target.value)}
                     value={endDate}
                     className='date-form'
                     />
                    <button type='submit' id='booking-submit-button'> Reserve</button>

        </form>
      </>
    );

    }
  export default BookingForm
