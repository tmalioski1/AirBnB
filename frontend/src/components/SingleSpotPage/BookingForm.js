import { makeNewBooking } from "../../store/bookings"
import { useHistory } from 'react-router-dom';
import {useState} from 'react'
import { useDispatch } from 'react-redux';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './BookingForm.css'

function BookingForm({spotsObj, spotId, sessionUser}) {

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
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

    const handleSubmit = async (e) => {
      e.preventDefault()



      const bookingData = {
          startDate,
          endDate
      }


      const postBooking = await dispatch(makeNewBooking(spotId, bookingData)).catch(
          async (res) => {
            const data = await res.json()
            if(data && data.errors) setErrors(data.errors)
          }
      )

      if(postBooking){
          history.push('/trips')
      }
  }

    return (
      <>
        <form onSubmit={handleSubmit} className="booking-form">
        {errors.length > 0 && (
        <div className="error-messages">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
        <div id='title-booking'>Book Your Vacation!</div>
                    <div className='nightlyPrice'>${spotsObj.price} night</div>
                    <div className='check-in-message'>CHECK-IN</div>
                     <input
                     type='date'
                     required
                     onChange={(e) => setStartDate(e.target.value)}
                     value={startDate}
                     className='date-form'
                     min={getCurrentDate()}
                     />

                     <div className='checkout-message'> CHECK-OUT</div>
                     <input
                     required
                     type='date'
                     onChange={(e) => setEndDate(e.target.value)}
                     value={endDate}
                     className='date-form'
                     min={startDate || getCurrentDate()}
                     />

                  {sessionUser ? (
                          <button type="submit" id="booking-submit-button">
                            Reserve
                          </button>
                        ) : (
                          <OpenModalButton
                          buttonText="Reserve"
                          modalComponent={<LoginFormModal />}
                        />
                        )}
        </form>
      </>
    );


  }
  export default BookingForm
