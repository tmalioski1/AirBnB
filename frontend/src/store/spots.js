
const LOAD = 'spots/LOAD'
const LOAD_ONE = 'spots/LOAD_ONE'

const loadAll = (spots) => ({
    type: LOAD,
    spots,
})



const loadOne = (spot) => ({
    type: LOAD_ONE,
    spot,
})


export const getAllSpots = () => async (dispatch) => {
    const response = await fetch(`/api/spots`);
    if (response.ok) {
      const spots = await response.json();
      dispatch(loadAll(spots));
    }
  };

  export const getOneSpot = (id) => async (dispatch) => {
    const response = await fetch(`/api/pokemon/${id}`)
    if (response.ok) {
        const oneSpot = await response.json();
        dispatch(loadOne(oneSpot));
    }
  }



const initialState = { allSpots : {}, singleSpot : {} }

const spotsReducer = (state = initialState, action) => {

    switch(action.type) {
       case LOAD:
        const newState = { allSpots : {}}
        action.spots.Spots.forEach(spot => {
            newState.allSpots[spot.id] = spot
        });

        return newState;

        case LOAD_ONE:
            const singleSpotState = { singleSpot: {}}

        return {
            singleSpotState

        }


      default:
      return state

    }
}

export default spotsReducer;
