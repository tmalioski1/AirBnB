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

    // if (reviews.length === 0) {
    //   return "You don't have a review yet, go to a spot's page to write a review!"
    // }

    useEffect(() => {
      const errors = [];

      if (reviews.length === 0) {
        errors.push("You do not have a review yet, go to a spot's page to write a review!")
      }


      setValidationErrors(errors);
    }, [reviews.length]);



return  (
    <>
     <ul className="user-review-error">
          {validationErrors.map((error) => (
            <div key={error}>{error}</div>
          ))}
       </ul>

    <ul className='all-userReviews-container'>
    {
        reviews.map(review => (
          <div className = 'userreview-container' key={review.id}>
           <li className='userreview'>{review.review}</li>
          </div>
        ))
      }

    </ul>
    </>

)


}

export default UserReviewsPage;
