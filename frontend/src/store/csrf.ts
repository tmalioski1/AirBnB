import Cookies from 'js-cookie';

// Define a type for the options object
interface CsrfFetchOptions extends RequestInit {
  // Add any custom headers or properties you might use
}

// Define a type for the response
type CsrfFetchResponse = Response;

export async function csrfFetch(url: string, options: CsrfFetchOptions = {}): Promise<CsrfFetchResponse> {
  // set options.method to 'GET' if there is no method
  options.method = options.method || 'GET';
  // set options.headers to an empty object if there are no headers
  options.headers = options.headers || {};

  // Ensure that options.headers is of type HeadersInit
  const headers: HeadersInit = options.headers;

  // if the options.method is not 'GET', then set the "Content-Type" header to
  // "application/json", and set the "XSRF-TOKEN" header to the value of the
  // "XSRF-TOKEN" cookie
  if (options.method.toUpperCase() !== 'GET') {
    // Ensure that headers is an instance of Headers
    const headersInstance = new Headers(headers);

    // Set the 'Content-Type' header to 'application/json'
    headersInstance.set('Content-Type', 'application/json');

    // Get the value of the 'XSRF-TOKEN' cookie
    const xsrfToken = Cookies.get('XSRF-TOKEN');

    // Set the 'XSRF-Token' header to the value of the 'XSRF-TOKEN' cookie
    if (xsrfToken) {
      headersInstance.set('XSRF-Token', xsrfToken);
    }

    // Assign the updated headers back to options
    options.headers = headersInstance;
  }

  // call the default window's fetch with the url and the options passed in
  const res = await window.fetch(url, options);

  // if the response status code is 400 or above, then throw an error with the
  // error being the response
  if (res.status >= 400) throw res;

  // if the response status code is under 400, then return the response to the
  // next promise chain
  return res;
}

export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}
