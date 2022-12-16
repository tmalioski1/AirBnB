import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllReviewsForUser } from '../../store/reviews';
import './UserReviewsPage.css';

function UserReviewsPage() {
const dispatch = useDispatch();
const reviewsObj = useSelector(state => state.reviews.user)
const reviews = Object.values(reviewsObj)
console.log('this is the reviewObj', reviewsObj)
console.log('this is the reviews array---', reviews)

useEffect(() => {
    dispatch(getAllReviewsForUser())
  }, [dispatch])

return  (
    <ul className='all-userReviews-container'>
    {
        reviews.map(review => (
          <div className = 'userreview-container' key={review.id}>
           <li className='userreview'>{review.review}</li>
          </div>
        ))
      }

    </ul>

)


}

export default UserReviewsPage;
