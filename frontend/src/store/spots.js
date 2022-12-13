
const LOAD = 'spots/LOAD'
const LOADONE = 'spots/LOADONE'

const loadAll = (spots) => ({
    type: LOAD,
    spots,
})




export const getAllSpots = () => async (dispatch) => {
    const response = await fetch(`/api/spots`);
    if (response.ok) {
      const spots = await response.json();
      dispatch(loadAll(spots));
    }
  };





const initialState = { allSpots : {}, singleSpot : {} }

const spotsReducer = (state = initialState, action) => {
    // const newState = {...state}
    switch(action.type) {
       case LOAD:
        const newSpots = { allSpots : {}, singleSpot : {}}
        action.spots.Spots.forEach(spot => {
            newSpots.allSpots[spot.id] = spot
        });

        return newSpots

    //    action.spots.forEach()
      default:
      return state

    }
}

export default spotsReducer;
