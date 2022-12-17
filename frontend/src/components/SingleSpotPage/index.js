import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import { getOneSpot, deleteOneSpot } from '../../store/spots';
import { getAllReviewsForSpot, deleteOneReview } from '../../store/reviews';
import './SingleSpotPage.css';


const SingleSpotPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotsObj = useSelector(state => state.spots.singleSpot);
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user);
  const owner = useSelector(state => state.spots.singleSpot.ownerId);
  const [validationErrors, setValidationErrors] = useState([]);
  const reviewsObj = useSelector(state => state.reviews.spot);
  const reviews = Object.values(reviewsObj)
  const spotImageArray = spotsObj.SpotImages




  useEffect(() => {
    dispatch(getOneSpot({ spotId }))
  }, [spotId, dispatch])

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
        errors.push('User already has a review for this spot')
        setValidationErrors(errors)
      }
    }


  }
  if (!spotImageArray) return null

  return (
    <>
      <h1>{spotsObj.description}</h1>
      <ul className="errors">
        {validationErrors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <div>
        <NavLink onClick={userValidation} to={`/spots/${spotId}/edit`}>Edit Your Spot</NavLink>
      </div>
      <div>
        <NavLink onClick={userReviewValidation} to={`/spots/${spotId}/review`}>Create A Review</NavLink>
      </div>
      <button onClick={deleteSpot}>Delete Spot</button>

      <ul className='singlespotpage-images-container'>
         {


            spotImageArray.map(spotImage => (

              <li className = 'spotpage-image-container' key={spotImage.id}>

              <img src={spotImage.url} alt='spotprevImage'></img>

            </li>

            ))

         }

      </ul>


      <ul className='all-reviews-container'>
      {
          reviews.map(review => (

            <div className = 'review-container' key={review.id}>
             <li className='review-text'>{review.review}</li>
             <li className='review-stars'>{review.stars}</li>
             <li className='review-id'>{review.id}</li>
             <button onClick={() => deleteReview(review.id)}>Delete Review</button>
            </div>
          ))
        }

      </ul>
    </>


  );
}

export default SingleSpotPage;
