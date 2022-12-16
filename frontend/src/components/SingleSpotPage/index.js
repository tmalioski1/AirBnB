import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import { getOneSpot, deleteOneSpot } from '../../store/spots';
import { getAllReviewsForSpot } from '../../store/reviews';
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
  console.log('this is the reviewsObj', reviewsObj)
  const reviews = Object.values(reviewsObj)

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

  const userValidation = (e) => {
    if (!sessionUser) {
      e.preventDefault();
      errors.push('User must be logged in to edit spot')
      setValidationErrors(errors);
    }
  }

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
      <button onClick={deleteSpot}>Delete Spot</button>
      <ul className='all-reviews-container'>
      {
          reviews.map(review => (
            <div className = 'review-container' key={review.id}>
             <li className='review'>{review.review}</li>
            </div>
          ))
        }

      </ul>
    </>


  );
}

export default SingleSpotPage;
