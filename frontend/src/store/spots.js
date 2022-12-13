
const LOAD = 'spots/LOAD'

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
        console.log('this is action.spots-------', action.spots)
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
