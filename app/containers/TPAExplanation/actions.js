/*
 * TPA Explanation Actions
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
  TPA_EXPLANATION_REQUESTING,
  TPA_EXPLANATION_SUCCESS,
  TPA_EXPLANATION_ERROR,
  TPA_CLAIM_STATUS_REQUESTING,
  TPA_CLAIM_STATUS_SUCCESS,
  TPA_CLAIM_STATUS_ERROR,
} from './constants';


/**
 * Fetches the login request, this action starts the request saga
 *
 * @return {object} An action object with a type of TPA_EXPLANATION_PAGE_INIT
 */

export function tpaExplanationRequest(payload) {
  console.log("Explanation request called");
  return {
    type: TPA_EXPLANATION_REQUESTING,
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

export function tpaExplanationSuccess(payload) {

  return {
    type: TPA_EXPLANATION_SUCCESS,
    payload
  };
}



/**
 * Dispatched when login fails
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of SP_DETAIL_ERROR passing the error
 */
export function tpaExplanationError(error) {
  toast.error("Error occured while getting claim", { autoClose: 4000 });

  return {
    type: TPA_EXPLANATION_ERROR,
    error,
  };
}

/**
 * Fetches the login request, this action starts the request saga
 *
 * @return {object} An action object with a type of TPA_CLAIM_STATUS_PAGE_INIT
 */

export function tpaClaimStatusRequest(payload) {
  console.log("Claim Status request called");
  return {
    type: TPA_CLAIM_STATUS_REQUESTING,
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

export function tpaClaimStatusSuccess(payload) {

  return {
    type: TPA_CLAIM_STATUS_SUCCESS,
    payload
  };
}



/**
 * Dispatched when login fails
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of SP_DETAIL_ERROR passing the error
 */
export function tpaClaimStatusError(error) {
  toast.error("Error occured while updating status of claim", { autoClose: 4000 });

  return {
    type: TPA_CLAIM_STATUS_ERROR,
    error,
  };
}