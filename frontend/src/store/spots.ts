import { csrfFetch } from './csrf';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

// Define types for spot objects
export interface Spot {
  id: number;
  ownerId: number;
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  name: string;
  description: string;
  price: number;
}

// Define action types
const LOAD = 'spots/LOAD';
const LOAD_ONE = 'spots/LOAD_ONE';
const CREATE_ONE = 'spots/CREATE_ONE';
const EDIT_ONE = 'spots/EDIT_ONE';
const DELETE_ONE = 'spots/DELETE_ONE';

// Define action creators with explicit return types
const loadAll = (spots: Spot[]): { type: typeof LOAD; spots: Spot[] } => ({
  type: LOAD,
  spots,
});

const loadOne = (spot: Spot): { type: typeof LOAD_ONE; spot: Spot } => ({
  type: LOAD_ONE,
  spot,
});

const createOne = (spot: Spot): { type: typeof CREATE_ONE; spot: Spot } => ({
  type: CREATE_ONE,
  spot,
});

const editOne = (spot: Spot): { type: typeof EDIT_ONE; spot: Spot } => ({
  type: EDIT_ONE,
  spot,
});

const deleteOne = (id: string): { type: typeof DELETE_ONE; id: string } => ({
  type: DELETE_ONE,
  id,
});

// Define initial state
interface SpotsState {
  allSpots: { [id: string]: Spot };
  singleSpot: Spot | null;
}

// Thunk action creators with explicit return types
export const getAllSpots = (): ThunkAction<void, SpotsState, unknown, Action<string>> => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`);
  if (response.ok) {
    const spots: Spot[] = await response.json();
    dispatch(loadAll(spots));
  }
};

export const getOneSpot = (id: number): ThunkAction<void, SpotsState, unknown, Action<string>> => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`);
  if (response.ok) {
    const oneSpot: Spot = await response.json();
    dispatch(loadOne(oneSpot));
  }
};

export const createOneSpot = (
  newSpot: Spot,
  newSpotImage: Blob
): ThunkAction<void, SpotsState, unknown, Action<string>> => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSpot),
  });

  if (response.ok) {
    const createdSpot: Spot = await response.json();
    dispatch(createOne(createdSpot));
  }
};

export const editOneSpot = (
  editedSpot: Spot,
  id: number
): ThunkAction<void, SpotsState, unknown, Action<string>> => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedSpot),
  });

  if (response.ok) {
    const editedSpotResponse: Spot = await response.json();
    dispatch(editOne(editedSpotResponse));
  }
};

export const deleteOneSpot = (
  id: number
): ThunkAction<void, SpotsState, unknown, Action<string>> => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(deleteOne(id.toString()));
  }
};

// Define spotsReducer with explicit return type
const spotsReducer = (state: SpotsState = { allSpots: {}, singleSpot: null }, action: any): SpotsState => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        allSpots: action.spots.reduce((acc: { [id: string]: Spot }, spot: Spot) => {
          acc[spot.id.toString()] = spot;
          return acc;
        }, {}),
      };
    case LOAD_ONE:
      return {
        ...state,
        singleSpot: action.spot,
      };
    case CREATE_ONE:
    case EDIT_ONE:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id.toString()]: action.spot,
        },
      };
    case DELETE_ONE:
      const newState = { ...state };
      delete newState.allSpots[action.id];
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
