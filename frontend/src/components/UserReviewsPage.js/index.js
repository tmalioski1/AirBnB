import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllReviewsForUser } from '../../store/reviews';
import './UserReviewsPage.css';

function UserReviewsPage() {
const dispatch = useDispatch();
const reviewsObj = useSelector(state => state.reviews.user)
const reviews = Object.values(reviewsObj)
const [validationErrors, setValidationErrors] = useState([]);

useEffect(() => {
    dispatch(getAllReviewsForUser())
  }, [dispatch])


    useEffect(() => {
      const errors = [];

      if (reviews.length === 0) {
        errors.push("You do not have a review yet, go to a spot's page to write a review!")
      }


      setValidationErrors(errors);
    }, [reviews.length]);


if (!reviews) return null
return  (
    <>
     <h1 className="userreview-page-title">User Reviews</h1>
     <ul className="user-review-error">
          {validationErrors.map((error) => (
            <div key={error}>{error}</div>
          ))}
       </ul>

    <div className='all-userReviews-container'>
    {
        reviews.map(review => (
          <div className = 'userreview-container' key={review.id}>
            <div className = "user-review-spot-name">Spot Name: {review.Spot?.name}</div>
            <div className = "user-review-location">Address: {review.Spot?.address}, {review.Spot?.city}, {review.Spot?.state}</div>
           <div className='user-review'>Review: {review.review}</div>
           <div className='user-review-stars'>Stars: {review.stars}</div>
           <div className= 'user-review-createdAt'>Created At: {review.createdAt.split('T')[0]} </div>
          </div>
        ))
      }

    </div>
    </>

)


}

export default UserReviewsPage;
