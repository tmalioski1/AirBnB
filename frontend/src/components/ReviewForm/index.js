import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import { createOneReview } from '../../store/reviews';
import './ReviewForm.css';

const ReviewForm = () => {
 const history = useHistory();
 const { spotId } = useParams();
 const dispatch = useDispatch()
 const [review, setReview] = useState("")
 const [stars, setStars] = useState("")
 const [validationErrors, setValidationErrors] = useState([]);
 const sessionUser = useSelector(state => state.session.user);


 useEffect(() => {
  const errors = [];
  if (!sessionUser) {
    errors.push('User must be logged in to create spot')
  }


  if (review.length === 0) {
    errors.push('Review text is required');
  }
  if (!Number(stars) || stars <1 || stars > 5) {
    errors.push('Stars must be an integer from 1 to 5');
  }


  setValidationErrors(errors);
}, [sessionUser, review, stars]);

const handleSubmit = async (e) => {
  e.preventDefault();

  const newReview = {
    review,
    stars
  };


  let createdReview = await dispatch(createOneReview(newReview, spotId));
  if (createdReview) {
    history.push(`/spots/${spotId}`);
  }
};

  return (
    <>
       <form className="review-form"
        onSubmit={handleSubmit}>
        <h1 className="review-form-header">Review Form</h1>
        <ul className="review-form-errors">
          {validationErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>

          <input
            type="text"
            value={review}
            placeholder= 'Reviews'
            onChange={(e) => setReview(e.target.value)}
            required
          />
          <input
            type="number"
            value={stars}
            placeholder= 'Stars'
            onChange={(e) => setStars(e.target.value)}
            required
          />
        <button type="submit">Create New Review</button>
      </form>
    </>


  );
}

export default ReviewForm;
