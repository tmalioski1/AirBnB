"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.restoreUser = exports.logout = exports.login = void 0;
const csrf_1 = require("./csrf");
// Define action types
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
// Define action creators
const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});
const removeUser = () => ({
    type: REMOVE_USER,
});
// Thunk action creators
const login = (user) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential, password } = user;
    const response = yield (0, csrf_1.csrfFetch)('/api/session', {
        method: 'POST',
        body: JSON.stringify({ credential, password }),
    });
    const data = yield response.json();
    dispatch(setUser(data.user));
    return response;
});
exports.login = login;
const logout = () => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)('/api/session', {
        method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
});
exports.logout = logout;
const restoreUser = () => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)('/api/session');
    const data = yield response.json();
    dispatch(setUser(data.user));
    return response;
});
exports.restoreUser = restoreUser;
const signup = (user) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, csrf_1.csrfFetch)("/api/users", {
        method: "POST",
        body: JSON.stringify(user),
    });
    const data = yield response.json();
    dispatch(setUser(data.user));
    return response;
});
exports.signup = signup;
const initialState = { user: null };
// Define sessionReducer
const sessionReducer = (state = initialState, action) => {
    var _a;
    switch (action.type) {
        case SET_USER:
            return Object.assign(Object.assign({}, state), { user: (_a = action.payload) !== null && _a !== void 0 ? _a : null });
        case REMOVE_USER:
            return Object.assign(Object.assign({}, state), { user: null });
        default:
            return state;
    }
};
exports.default = sessionReducer;
