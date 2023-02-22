/*
 * TPA Login Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import { toast } from "react-toastify";
import {
  TPA_LOGIN_PAGE_INIT,
  TPA_LOGIN_ERROR,
  TPA_LOGIN_REQUESTING,
  TPA_LOGIN_SUCCESS,
} from './constants';


/**
 * Fetches the login page, this action starts the request saga
 *
 * @return {object} An action object with a type of TPA_LOGIN_PAGE_INIT
 */

export function tpaLoginPageInit() {
  console.log("Login action called");
  return {
    type: TPA_LOGIN_PAGE_INIT,
  };
}

/**
 * Fetches the login request, this action starts the request saga
 *
 * @return {object} An action object with a type of TPA_LOGIN_PAGE_INIT
 */

export function tpaLoginRequest(payload) {
  console.log("Login request called");
  return {
    type: TPA_LOGIN_REQUESTING,
    payload
  };
}

/**
 * Dispatched login details are loaded by the request saga
 *
 * @param  {string} payload The current username
 *
 * @return {object}      An action object with a type of SP_DETAIL_SUCCESS passing the payload
 */

export function tpaLoginSuccess() {
  //toast.success("Logged In Successful", { autoClose: 4000 });

  return {
    type: TPA_LOGIN_SUCCESS,
  };
}



/**
 * Dispatched when login fails
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of SP_DETAIL_ERROR passing the error
 */
export function tpaLoginError(error) {
  switch (error.e.error) {
    case "Password doesn't match!":
      toast.error("Password doesn't match", { autoClose: 4000 });
      break;
    case "email id  doesn't match!":
      toast.error("User doesn't exists", { autoClose: 4000 })
      break;
    case "Not TPA":
      toast.error("User don't has required access", { autoClose: 4000 })
      break;
    default:
      toast.error("Error occured while logging in", { autoClose: 4000 })
  }

  return {
    type: TPA_LOGIN_ERROR,
    error,
  };
}