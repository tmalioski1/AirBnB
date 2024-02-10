"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureStore = void 0;
const redux_1 = require("redux");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const session_1 = __importDefault(require("./session"));
const spots_1 = __importDefault(require("./spots"));
const reviews_1 = __importDefault(require("./reviews"));
const bookings_1 = __importDefault(require("./bookings"));
// Define root reducer
const rootReducer = (0, redux_1.combineReducers)({
    session: session_1.default,
    spots: spots_1.default,
    reviews: reviews_1.default,
    bookings: bookings_1.default,
});
let enhancer;
// Configure enhancer based on environment
if (process.env.NODE_ENV === "production") {
    enhancer = (0, redux_1.applyMiddleware)(redux_thunk_1.default);
}
else {
    const logger = require("redux-logger").default;
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux_1.compose;
    enhancer = composeEnhancers((0, redux_1.applyMiddleware)(redux_thunk_1.default, logger));
}
// Define configureStore function
const configureStore = (preloadedState) => {
    return (0, redux_1.createStore)(rootReducer, preloadedState, enhancer);
};
exports.configureStore = configureStore;
