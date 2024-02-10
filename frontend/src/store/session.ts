import { csrfFetch } from './csrf';


// Define action types
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

// Define user type
export interface User {
  id: number;
  firstName : string;
  lastName : string;
  username : string;
  email : string;
  password : string;

}

// Define action creators
const setUser = (user: User): { type: string; payload: User } => ({
    type: SET_USER,
    payload: user,
  });

  const removeUser = (): { type: string } => ({
    type: REMOVE_USER,
  });

  // Thunk action creators
  export const login = (user: { credential: string; password: string }) => async (dispatch: Function) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({ credential, password }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

  export const logout = () => async (dispatch: Function) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
  };

  export const restoreUser = () => async (dispatch: Function) => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

  export const signup = (user: User) => async (dispatch: Function) => {
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

  // Define initial state
  interface SessionState {
    user: User | null; // Ensure user is explicitly typed as User or null
  }

  const initialState: SessionState = { user: null };

  // Define sessionReducer
  const sessionReducer = (state: SessionState = initialState, action: { type: string; payload?: User }): SessionState => {
    switch (action.type) {
      case SET_USER:
        return { ...state, user: action.payload ?? null };
      case REMOVE_USER:
        return { ...state, user: null };
      default:
        return state;
    }
  };

  export default sessionReducer;
