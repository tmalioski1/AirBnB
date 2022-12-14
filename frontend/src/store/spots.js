import { csrfFetch } from './csrf'

const LOAD = 'spots/LOAD'
const LOAD_ONE = 'spots/LOAD_ONE'
const CREATE_ONE = 'spots/CREATE_ONE'

const loadAll = (spots) => ({
  type: LOAD,
  spots,
})



const loadOne = (spot) => ({
  type: LOAD_ONE,
  spot,
})

const createOne = (spot) => ({
  type: CREATE_ONE,
  spot
})


export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`);
  if (response.ok) {
    const spots = await response.json();
    // console.log('spots in thunk---', spots)
    dispatch(loadAll(spots));
  }
  return response
};

export const getOneSpot = (id) => async (dispatch) => {
  const { spotId } = id
  const response = await csrfFetch(`/api/spots/${spotId}`)
  if (response.ok) {
    const oneSpot = await response.json();
    dispatch(loadOne(oneSpot));
  }
  return response
}

export const createOneSpot = (newSpot) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSpot),
  })

}

const initialState = { allSpots: {}, singleSpot: {} }

const spotsReducer = (state = initialState, action) => {

  switch (action.type) {
    case LOAD: {
      const newState = { allSpots: {}, singleSpot: {} }
      action.spots.Spots.forEach(spot => {
        newState.allSpots[spot.id] = spot
      });

      return newState;
    }

    case LOAD_ONE: {
      const newState = { allSpots: {}, singleSpot: {} }
      newState.singleSpot = action.spot
      return newState
    }

    case CREATE_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots}}
      newState.allSpots[spot.id] = spot;
    }
    default:
      return state

  }
}

export default spotsReducer;
