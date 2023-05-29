import { csrfFetch } from './csrf'

const LOAD = 'bookings/LOAD'
const CREATE = 'bookings/CREATE'
const EDIT = 'bookings/EDIT'
const DELETE = 'bookings/delete'

const getBookings = (bookings) => ({
    type: LOAD,
    bookings
})


const makeBooking = (booking) => ({
    type: CREATE,
    booking
})


const editBooking = (booking) => ({
    type:EDIT,
    booking
})


const deleteBooking = (id) => ({
    type: DELETE,
    id
})

export const getCurrentBookings = () => async (dispatch) => {
    const response = await csrfFetch('/api/bookings/current')

    if(response.ok){
        const yourBookings = await response.json()
        dispatch(getBookings(yourBookings))
    }
}

export const makeNewBooking = (spotId, newBooking) => async (dispatch) => {
    console.log('this is the spotId---', spotId)
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
    })
    console.log('this is the response', response)
    if(response.ok){
        const yourNewBooking = await response.json()
        dispatch(makeBooking(yourNewBooking))
        return yourNewBooking
    } else{
        const error = await response.json()
        return error
    }
}

export const editYourBooking = (id, booking) => async (dispatch) =>{
    const response = await csrfFetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
    })
    if(response.ok){
        const editedBooking = await response.json()
        dispatch(editBooking(editBooking))
        getCurrentBookings()
        return editedBooking
    }


}


export const deleteYourBooking = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${id}`,{
        method:'DELETE'
    })

    if(response.ok){
        const deletedBooking = await response.json()
        dispatch(deleteBooking(id))
        return deletedBooking
    }
}



const initialState = {bookings: {}}
const bookingReducer = (state = initialState, action ) => {
    switch(action.type){
        case LOAD:{
            const newState = {...state}
            const yourBookings = {...state.bookings}
            action.bookings.Bookings.forEach(booking => yourBookings[booking.id] = booking)
            newState.bookings = yourBookings
            return newState
        }
        case CREATE:{
            const newState = {...state}
            const newBooking = {...state.bookings}
            newBooking[action.booking.id] = action.booking
            newState.bookings = newBooking
            return newState
        }
        case DELETE:{
            const newState = {...state}
            const newBooking = {...state.bookings}
            delete newBooking[action.id]
            newState.bookings = newBooking
            return newState
        }

        default:
            return state
    }
}

export default bookingReducer
