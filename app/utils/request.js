import axios from "axios";

const API_ROOT = process.env.REACT_APP_NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {

  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
//Add Logic to send tokens with request

// export default function request(url, options) {

//   url = API_ROOT+url;
//   console.log("url for req", url, options);
//   return fetch(url, options)
//     .then(checkStatus)
//     .then(parseJSON);
// }

//Add Error Handling Logic here

export default function request(method, url, payload = null, headers = 1) {
  let requestData = {
    method,
    url,
    // url: API_ROOT + url
  }
  if (payload) {
    requestData.data = payload;
  }

  if (headers === 1)
    requestData.headers = {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    };
  let response = axios(requestData);

  return response;
}