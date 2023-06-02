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
          <div className='nightlyPrice-stars'>
          <div className='bookingform-nightlyPrice'>${Number(spotsObj?.price).toFixed(2)} <span className='night'>night</span></div>
          <div className='bookingform-stars'>
          <div className= 'bookingform--star-ratings'>
          <i className="fa-solid fa-star fa-sm" ></i>
          {spotsObj.avgStarRating}
          </div>
          <span className='period'>.</span>
        <div className="bookingform-num-reviews">{spotsObj?.numReviews} Review(s)</div>
        </div>
        </div>
        <div className='bookingform-checkin-checkout-container'>
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
</div>
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
