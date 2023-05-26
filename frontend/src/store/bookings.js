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
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
    })
    console.log('back', response)
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
