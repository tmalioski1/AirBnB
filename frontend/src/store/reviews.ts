import { csrfFetch } from './csrf'
import { Spot } from './spots'
import { User } from './session'


interface Reviews {
  id: number;
  spotId: number;
  userId: number;
  review: string;
  stars: number;
}

const LOAD = 'reviews/LOAD'
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS'
const CREATE_ONE = 'reviews/CREATE_ONE'
const DELETE_ONE = 'reviews/DELETE_ONE'

const loadAllReviewsForSpot = (reviews: Reviews[]) => ({
  type: LOAD,
  reviews,
})

const loadAllReviewsForUser = (reviews: Reviews[]) => ({
  type: LOAD_USER_REVIEWS,
  reviews,
})

const createReview = (review: Reviews) => ({
  type: CREATE_ONE,
  review,
})

const deleteReview = (review: Reviews) => ({
  type: DELETE_ONE,
  review
})

interface ReviewsState {
  spot: Spot | null
  user: User | null

}

export const getAllReviewsForSpot = (id) => async (dispatch) => {
    const { spotId } = id
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const reviews = await response.json();
      dispatch(loadAllReviewsForSpot(reviews));
    }
    return response
  };

  export const getAllReviewsForUser = () => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/current`);
    if (response.ok) {
      const reviews = await response.json();
      dispatch(loadAllReviewsForUser(reviews));
    }
    return response
  };

  export const createOneReview = (newReview, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    })
    if (response.ok) {
      const newReview = await response.json();
      dispatch(createReview(newReview))
      return newReview
    }

  }

  export const deleteOneReview = (reviewId) => async(dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
     method: 'DELETE',
    })
    if (response.ok) {
     const review = await response.json();
     dispatch(deleteReview(review));
    }
 }


const initialState = { spot: {}, user: {} }

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
     case LOAD: {
        const newState = { spot: {}, user: {} }
        action.reviews.Reviews.forEach(review => {
            newState.spot[review.id] = review
        })

        return newState;
     }

     case LOAD_USER_REVIEWS: {
       const newState = { spot: {}, user: {} }
       action.reviews.Reviews.forEach(review => {
        newState.user[review.id] = review
       })
        return newState;
     }
     case CREATE_ONE: {
      const newState = { ...state, spot: { ...state.spot}}
      newState.spot[action.review.id] = action.review;
      return newState
    }

    case DELETE_ONE: {
      const newState = {...state, spot: {...state.spot}}
      delete newState.spot[action.id]
    }

    default:
      return state

      }


}

export default reviewsReducer;
