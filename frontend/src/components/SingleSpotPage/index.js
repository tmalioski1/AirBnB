import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import { getOneSpot, deleteOneSpot } from '../../store/spots';
import { getAllReviewsForSpot, deleteOneReview } from '../../store/reviews';
import BookingForm from './BookingForm';
import './SingleSpotPage.css';


const SingleSpotPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotsObj = useSelector(state => state?.spots?.singleSpot);
  const history = useHistory()
  const sessionUser = useSelector(state => state?.session?.user);
  const owner = useSelector(state => state?.spots?.singleSpot?.ownerId);
  const [validationErrors, setValidationErrors] = useState([]);
  const reviewsObj = useSelector(state => state?.reviews?.spot);
  const reviews = Object.values(reviewsObj)
  const spotImageArray = spotsObj?.SpotImages



  useEffect(() => {
    dispatch(getOneSpot({ spotId }))
    document.title = spotsObj?.description
  }, [spotId, dispatch, spotsObj?.description])



  useEffect(() => {
    dispatch(getAllReviewsForSpot({ spotId }))
  }, [spotId, dispatch])



  const errors = [];
  const deleteSpot = async (e) => {
    e.preventDefault();
    if (!sessionUser) {
      errors.push('User must be logged in to delete spot')
      setValidationErrors(errors);
    }

    else if (sessionUser.id !== owner) {
      errors.push('Must own spot to delete spot')
      setValidationErrors(errors);
    }

    else {
      await dispatch(deleteOneSpot(spotId))
      history.push('/')
    }
  }
  const deleteReview = async (reviewId) => {
    if (!sessionUser) {
      errors.push('User must be logged in to delete review')
      setValidationErrors(errors);
    }
    for (let i = 0; i < reviews.length; i++) {
      let review = reviews[i]
      if (sessionUser.id !== review.userId) {
        errors.push('Review must belong to the current user')
        setValidationErrors(errors);
      }
      await dispatch(deleteOneReview(reviewId))
      history.push('/')
    }

  }

  const userValidation = (e) => {
    if (!sessionUser) {
      e.preventDefault();
      errors.push('User must be logged in to edit spot')
      setValidationErrors(errors);
    }
  }

  const userReviewValidation = (e) => {
    if (!sessionUser) {
      e.preventDefault();
      errors.push('User must be logged in to review a spot')
      setValidationErrors(errors);
    }
    if (sessionUser.id === owner) {
      e.preventDefault();
      errors.push('Review cannot be made by spot owner')
      setValidationErrors(errors);
    }

    for (let i = 0; i < reviews.length; i++) {
      if (sessionUser.id === reviews[i].User.id) {
        e.preventDefault();
        errors.push('You already made a review for this spot')
        setValidationErrors(errors)
      }
    }


  }


  if (!spotImageArray) return null

  return (
    <>
      <div className="spot-description-container">
        <h1 className='spot-description'>{spotsObj.description}</h1>
      </div>
      <div className="spot-details-main">
        <div className="spot-details-top-left">
          <div className= 'spot-details-star-ratings'>
          <i className="fa-solid fa-star fa-sm" ></i>
          {spotsObj.avgStarRating}
          </div>
        <div className="spot-details-num-reviews">{spotsObj?.numReviews} Review(s)</div>
        <div className="spot-details-location">{spotsObj?.city}, {spotsObj?.state}, {spotsObj?.country}</div>
        </div>
        {sessionUser && sessionUser?.id === owner &&
        <div className="spot-details-edit">
          <NavLink onClick={userValidation} to={`/spots/${spotId}/edit`}>Edit Spot Details</NavLink>
        </div>}
      {sessionUser && sessionUser?.id === owner &&
        <div>
          <button className="spot-details-delete" onClick={deleteSpot}>Delete Spot</button>
        </div>}
      </div>

      <ul className='singlespotpage-images-container'>
        {

          spotImageArray.map(spotImage => (

            <div className='spotpage-image-container' key={spotImage.id}>
              <img className='actual-spotImage' src={spotImage?.url} alt='spotprevImage'></img>
            </div>

          ))

        }
      </ul>

      <div className='reviews-bookings'>
      <div className='reviews'>
      <div className='review-top-line'>
      <div className='home-hosted'>Entire home hosted by {spotsObj?.Owner?.firstName}</div>
      </div>
      <div className='line-div'></div>
      <div className='review-info'>
      <ul className="singlespot-errors">
        {validationErrors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      {sessionUser && sessionUser?.id !== owner &&

      <NavLink className="create-review-navlink" onClick={userReviewValidation} to={`/spots/${spotId}/review`}>Create A Review</NavLink>
      }
      <div className='all-reviews-container'>
        {
          reviews.map(review => (

            <div className='review-container' key={review?.id}>
              <div className='review-user'>Review by {review?.User?.firstName} {review?.User?.lastName}:</div>
              <div className='review-text'>Description: {review?.review}</div>
              <div className='review-stars'>Stars: {review?.stars}</div>
              <div className='created-at'>Created at {review?.createdAt.split('T')[0]}</div>
              {sessionUser && sessionUser.id === review?.User?.id &&
              <button className="review-delete" onClick={() => deleteReview(review.id)}>Delete Review</button>
              }
            </div>
          ))
        }

      </div>
      </div>
      </div>
      {sessionUser?.id !== owner &&
      <div className='booking-container'>
      <BookingForm spotsObj={spotsObj} spotId={spotId} sessionUser={sessionUser}/>
      </div>
}
</div>
    </>


  );
}

export default SingleSpotPage;
