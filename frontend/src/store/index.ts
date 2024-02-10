import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from './session';
import spotsReducer from './spots';
import reviewsReducer  from "./reviews";
import bookingsReducer  from "./bookings";

// Define RootState type
type RootState = ReturnType<typeof rootReducer>;

// Define root reducer
const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  reviews: reviewsReducer,
  bookings: bookingsReducer,
});

let enhancer : any;

// Configure enhancer based on environment
if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// Define configureStore function
const configureStore = (preloadedState?: RootState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export { configureStore, RootState };
