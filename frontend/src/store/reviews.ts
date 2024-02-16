import { csrfFetch } from './csrf';
import { Spot } from './spots';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { User } from './session';

interface Review {
  id: number;
  spotId: number;
  userId: number;
  review: string;
  stars: number;
}

// Define action types
const LOAD = 'reviews/LOAD';
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS';
const CREATE_ONE = 'reviews/CREATE_ONE';
const DELETE_ONE = 'reviews/DELETE_ONE';

// Define action creators
const loadAllReviewsForSpot = (reviews: Review[]): { type: typeof LOAD; reviews: Review[] } => ({
  type: LOAD,
  reviews,
});

const loadAllReviewsForUser = (reviews: Review[]): { type: typeof LOAD_USER_REVIEWS; reviews: Review[] } => ({
  type: LOAD_USER_REVIEWS,
  reviews,
});

const createReview = (review: Review): { type: typeof CREATE_ONE; review: Review } => ({
  type: CREATE_ONE,
  review,
});

const deleteReview = (review: Review): { type: typeof DELETE_ONE; review: Review } => ({
  type: DELETE_ONE,
  review,
});

// Define state interface
interface ReviewsState {
  spot: { [id: number]: Review };
  user: { [id: number]: Review };
}

// Thunk action creators
export const getAllReviewsForSpot = (
  id: number
): ThunkAction<void, ReviewsState, unknown, Action<string>> => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}/reviews`);
  if (response.ok) {
    const reviews: Review[] = await response.json();
    dispatch(loadAllReviewsForSpot(reviews));
  }
};

export const getAllReviewsForUser = (): ThunkAction<void, ReviewsState, unknown, Action<string>> => async (
  dispatch
) => {
  const response = await csrfFetch(`/api/reviews/current`);
  if (response.ok) {
    const reviews: Review[] = await response.json();
    dispatch(loadAllReviewsForUser(reviews));
  }
};

export const createOneReview = (
  newReview: Review,
  spotId: number
): ThunkAction<void, ReviewsState, unknown, Action<string>> => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newReview),
  });
  if (response.ok) {
    const createdReview: Review = await response.json();
    dispatch(createReview(createdReview));
  }
};

export const deleteOneReview = (
  reviewId: number
): ThunkAction<void, ReviewsState, unknown, Action<string>> => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    const deletedReview: Review = await response.json();
    dispatch(deleteReview(deletedReview));
  }
};

// Define initial state
const initialState: ReviewsState = { spot: {}, user: {} };

// Define reducer
const reviewsReducer = (state: ReviewsState = initialState, action: any): ReviewsState => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        spot: action.reviews.reduce((acc: { [key: number]: Review }, review: Review) => {
          acc[review.id] = review;
          return acc;
        }, {}),
      };
    case LOAD_USER_REVIEWS:
      return {
        ...state,
        user: action.reviews.reduce((acc: { [key: number]: Review }, review: Review) => {
          acc[review.id] = review;
          return acc;
        }, {}),
      };

    case CREATE_ONE:
      return {
        ...state,
        spot: {
          ...state.spot,
          [action.review.id]: action.review,
        },
      };
    case DELETE_ONE:
      const newState = { ...state };
      delete newState.spot[action.review.id];
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
