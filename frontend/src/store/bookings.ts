import { csrfFetch } from './csrf'
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';



interface Booking {
id: number;
spotId: number;
userId: number;
startDate: number;
endDate: number

}

const LOAD = 'bookings/LOAD'
const CREATE = 'bookings/CREATE'
const EDIT = 'bookings/EDIT'
const DELETE = 'bookings/delete'



const getBookings = (bookings: Booking[]): {type: typeof LOAD; bookings: Booking[] } => ({
    type: LOAD,
    bookings
})


const makeBooking = (booking: Booking): { type: typeof CREATE; booking: Booking} => ({
    type: CREATE,
    booking
})


const editBooking = (booking: Booking): {type: typeof EDIT; booking: Booking} => ({
    type:EDIT,
    booking
})


const deleteBooking = (id: string): {type: typeof DELETE; id: string} => ({
    type: DELETE,
    id
})

interface BookingsState {
    bookings: {[id: string]: Booking }
}

export const getCurrentBookings = ():ThunkAction<void, BookingsState, unknown, Action<string>> => async (dispatch) => {
    const response = await csrfFetch('/api/bookings/current')

    if(response.ok){
        const yourBookings: Booking[] = await response.json()
        dispatch(getBookings(yourBookings))
    }
}

export const makeNewBooking = (spotId: number, newBooking: Booking): ThunkAction<Promise<Booking | void>, BookingsState, unknown, Action<string>> => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
    });

    if (response.ok) {
        const yourNewBooking: Booking = await response.json();
        dispatch(makeBooking(yourNewBooking));
        return yourNewBooking;
    } else {
        const error = await response.json();
        return error;
    }
};

export const editYourBooking = (id: number, booking: Booking): ThunkAction<Promise<Booking | void>, BookingsState, unknown, Action<string>> => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
    });

    if (response.ok) {
        const editedBooking = await response.json();
        dispatch(editBooking(editedBooking));
        dispatch(getCurrentBookings());
        return editedBooking;
    }
};


export const deleteYourBooking = (id: number): ThunkAction<Promise<Booking | void>, BookingsState, unknown, Action<string>> => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        const deletedBooking = await response.json();
        dispatch(deleteBooking(id.toString()));
        return deletedBooking;
    }
};



const initialState: BookingsState = { bookings: {} };
const bookingsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case LOAD: {
            const newState = { ...state };
            const yourBookings = { ...state.bookings };
            action.bookings.forEach((booking: Booking) => (yourBookings[booking.id.toString()] = booking));
            newState.bookings = yourBookings;
            return newState;
        }
        case CREATE: {
            const newState = { ...state };
            const newBooking = { ...state.bookings };
            newBooking[action.booking.id.toString()] = action.booking;
            newState.bookings = newBooking;
            return newState;
        }
        case DELETE: {
            const newState = { ...state };
            const newBooking = { ...state.bookings };
            delete newBooking[action.id];
            newState.bookings = newBooking;
            return newState;
        }
        default:
            return state;
    }
}

export default bookingsReducer
