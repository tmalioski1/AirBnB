import { csrfFetch } from './csrf'

const LOAD = 'reviews/LOAD'
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS'
// const CREATE_ONE = 'reviews/CREATE_ONE'
// const DELETE_ONE = 'reviews/DELETE_ONE'

const loadAllReviewsForSpot = (reviews) => ({
  type: LOAD,
  reviews,
})

const loadAllReviewsForUser = (reviews) => ({
  type: LOAD_USER_REVIEWS,
  reviews,
})

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
       console.log('this is action.reviews.Reviews', action.reviews.Reviews)
       action.reviews.Reviews.forEach(review => {
        newState.user[review.id] = review
       })
        return newState;
     }

        default:
          return state

      }


}

export default reviewsReducer;
