import { csrfFetch } from './csrf'

const LOAD = 'spots/LOAD'
const LOAD_ONE = 'spots/LOAD_ONE'
const CREATE_ONE = 'spots/CREATE_ONE'
const EDIT_ONE = 'spots/EDIT_ONE'
const DELETE_ONE = 'spots/DELETE_ONE'

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

const editOne = (spot) => ({
  type: EDIT_ONE,
  spot
})

const deleteOne = (id) => ({
  type: DELETE_ONE,
  id
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

export const createOneSpot = (newSpot, newSpotImage) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSpot),
  })

  if (response.ok) {
    const newSpot = await response.json();

    const response2 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSpotImage)
    })

    if (response2.ok){
      dispatch(createOne(newSpot));
      return newSpot
    }
  }

}

export const editOneSpot = (editedSpot, id) => async(dispatch) => {
   const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedSpot)
   });

   if (response.ok) {
    const editedSpot = await response.json();
    dispatch(editOne(editedSpot))
    return editedSpot;
   }
}

export const deleteOneSpot = (id) => async(dispatch) => {
   const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'DELETE',
   })
   if (response.ok) {
    const spot = await response.json();
    dispatch(deleteOne(spot));
   }
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

    case CREATE_ONE: {
      const newState = { ...state, allSpots: { ...state.allSpots}}
      newState.allSpots[action.spot.id] = action.spot;
      return newState
    }

    case EDIT_ONE: {
      const newState = { ...state, allSpots: { ...state.allSpots}}
      newState.allSpots[action.spot.id] = action.spot;
      return newState
    }

      case DELETE_ONE: {
      const newState = {...state, allSpots: { ...state.allSpots}}
      delete newState.allSpots[action.id]
      return newState
    }

    default:
      return state

  }
}

export default spotsReducer;
