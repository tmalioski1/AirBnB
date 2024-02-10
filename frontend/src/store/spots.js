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
exports.createOneSpot = exports.getOneSpot = exports.getAllSpots = void 0;
const csrf_1 = require("./csrf");
// Define action types
const LOAD = 'spots/LOAD';
const LOAD_ONE = 'spots/LOAD_ONE';
const CREATE_ONE = 'spots/CREATE_ONE';
const EDIT_ONE = 'spots/EDIT_ONE';
const DELETE_ONE = 'spots/DELETE_ONE';
// Define action creators
const loadAll = (spots) => ({
    type: LOAD,
    spots,
});
const loadOne = (spot) => ({
    type: LOAD_ONE,
    spot,
});
const createOne = (spot) => ({
    type: CREATE_ONE,
    spot,
});
const editOne = (spot) => ({
    type: EDIT_ONE,
    spot,
});
const deleteOne = (id) => ({
    type: DELETE_ONE,
    id,
});
// Thunk action creators
const getAllSpots = () => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)(`/api/spots`);
    if (response.ok) {
        const spots = yield response.json();
        dispatch(loadAll(spots));
    }
});
exports.getAllSpots = getAllSpots;
const getOneSpot = (id) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)(`/api/spots/${id}`);
    if (response.ok) {
        const oneSpot = yield response.json();
        dispatch(loadOne(oneSpot));
    }
});
exports.getOneSpot = getOneSpot;
const createOneSpot = (newSpot, newSpotImage) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot),
    });
    if (response.ok) {
        const newSpot = yield response.json();
        // Assuming you want to dispatch createOne action here
        dispatch(createOne(newSpot));
    }
});
exports.createOneSpot = createOneSpot;
// Define other thunk action creators (editOneSpot, deleteOneSpot)
// Define spotsReducer
const spotsReducer = (state = { allSpots: {}, singleSpot: null }, action) => {
    switch (action.type) {
        case LOAD:
            return Object.assign(Object.assign({}, state), { allSpots: action.spots.reduce((acc, spot) => {
                    acc[spot.id] = spot;
                    return acc;
                }, {}) });
        case LOAD_ONE:
            return Object.assign(Object.assign({}, state), { singleSpot: action.spot });
        case CREATE_ONE:
        case EDIT_ONE:
            return Object.assign(Object.assign({}, state), { allSpots: Object.assign(Object.assign({}, state.allSpots), { [action.spot.id]: action.spot }) });
        case DELETE_ONE:
            const newState = Object.assign({}, state);
            delete newState.allSpots[action.id];
            return newState;
        default:
            return state;
    }
};
exports.default = spotsReducer;
