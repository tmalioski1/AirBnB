import { csrfFetch } from './csrf'

const LOAD = 'reviews/LOAD'
// const LOAD_ONE = 'reviews/LOAD_ONE'
// const CREATE_ONE = 'reviews/CREATE_ONE'
// const DELETE_ONE = 'reviews/DELETE_ONE'

const loadAllReviewsForSpot = (reviews) => ({
  type: LOAD,
  reviews,
})

export const getAllReviewsForSpot = (id) => async (dispatch) => {
    const { spotId } = id
    console.log('this is the id', id)
    console.log('this is the spotId', spotId)
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const reviews = await response.json();
      dispatch(loadAllReviewsForSpot(reviews));
    }
    return response
  };



const initialState = { spot: {}, user: {} }

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
     case LOAD: {
        const newState = { spot: {}, user: {} }
        console.log(Array.isArray(action.reviews.Reviews))
        console.log('this is action.reviews.Reviews', action.reviews.Reviews)
        action.reviews.Reviews.forEach(review => {
            newState.spot[review.id] = review
        })

        return newState;
     }

        default:
          return state

      }

}

export default reviewsReducer;
