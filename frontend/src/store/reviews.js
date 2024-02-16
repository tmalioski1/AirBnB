"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneReview = exports.createOneReview = exports.getAllReviewsForUser = exports.getAllReviewsForSpot = void 0;
const csrf_1 = require("./csrf");
// Define action types
const LOAD = 'reviews/LOAD';
const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS';
const CREATE_ONE = 'reviews/CREATE_ONE';
const DELETE_ONE = 'reviews/DELETE_ONE';
// Define action creators
const loadAllReviewsForSpot = (reviews) => ({
    type: LOAD,
    reviews,
});
const loadAllReviewsForUser = (reviews) => ({
    type: LOAD_USER_REVIEWS,
    reviews,
});
const createReview = (review) => ({
    type: CREATE_ONE,
    review,
});
const deleteReview = (review) => ({
    type: DELETE_ONE,
    review,
});
// Thunk action creators
const getAllReviewsForSpot = (id) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)(`/api/spots/${id}/reviews`);
    if (response.ok) {
        const reviews = yield response.json();
        dispatch(loadAllReviewsForSpot(reviews));
    }
});
exports.getAllReviewsForSpot = getAllReviewsForSpot;
const getAllReviewsForUser = () => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)(`/api/reviews/current`);
    if (response.ok) {
        const reviews = yield response.json();
        dispatch(loadAllReviewsForUser(reviews));
    }
});
exports.getAllReviewsForUser = getAllReviewsForUser;
const createOneReview = (newReview, spotId) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
    });
    if (response.ok) {
        const createdReview = yield response.json();
        dispatch(createReview(createdReview));
    }
});
exports.createOneReview = createOneReview;
const deleteOneReview = (reviewId) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        const deletedReview = yield response.json();
        dispatch(deleteReview(deletedReview));
    }
});
exports.deleteOneReview = deleteOneReview;
// Define initial state
const initialState = { spot: {}, user: {} };
// Define reducer
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            return Object.assign(Object.assign({}, state), { spot: action.reviews.reduce((acc, review) => {
                    acc[review.id] = review;
                    return acc;
                }, {}) });
        case LOAD_USER_REVIEWS:
            return Object.assign(Object.assign({}, state), { user: action.reviews.reduce((acc, review) => {
                    acc[review.id] = review;
                    return acc;
                }, {}) });
        case CREATE_ONE:
            return Object.assign(Object.assign({}, state), { spot: Object.assign(Object.assign({}, state.spot), { [action.review.id]: action.review }) });
        case DELETE_ONE:
            const newState = Object.assign({}, state);
            delete newState.spot[action.review.id];
            return newState;
        default:
            return state;
    }
};
exports.default = reviewsReducer;
