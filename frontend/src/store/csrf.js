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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreCSRF = exports.csrfFetch = void 0;
const js_cookie_1 = __importDefault(require("js-cookie"));
function csrfFetch(url, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // set options.method to 'GET' if there is no method
        options.method = options.method || 'GET';
        // set options.headers to an empty object if there are no headers
        options.headers = options.headers || {};
        // Ensure that options.headers is of type HeadersInit
        const headers = options.headers;
        // if the options.method is not 'GET', then set the "Content-Type" header to
        // "application/json", and set the "XSRF-TOKEN" header to the value of the
        // "XSRF-TOKEN" cookie
        if (options.method.toUpperCase() !== 'GET') {
            // Ensure that headers is an instance of Headers
            const headersInstance = new Headers(headers);
            // Set the 'Content-Type' header to 'application/json'
            headersInstance.set('Content-Type', 'application/json');
            // Get the value of the 'XSRF-TOKEN' cookie
            const xsrfToken = js_cookie_1.default.get('XSRF-TOKEN');
            // Set the 'XSRF-Token' header to the value of the 'XSRF-TOKEN' cookie
            if (xsrfToken) {
                headersInstance.set('XSRF-Token', xsrfToken);
            }
            // Assign the updated headers back to options
            options.headers = headersInstance;
        }
        // call the default window's fetch with the url and the options passed in
        const res = yield window.fetch(url, options);
        // if the response status code is 400 or above, then throw an error with the
        // error being the response
        if (res.status >= 400)
            throw res;
        // if the response status code is under 400, then return the response to the
        // next promise chain
        return res;
    });
}
exports.csrfFetch = csrfFetch;
function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}
exports.restoreCSRF = restoreCSRF;
