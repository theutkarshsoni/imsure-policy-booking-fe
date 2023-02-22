import {
    // SP_DETAIL_INIT,
    // SP_DETAIL_SUCCESS,
    // SP_DETAIL_ERROR,
  
    QUP,
    QUP_SUCCESS,
    QUP_ERROR,
  
    INQ,
    INQ_SUCCESS,
    INQ_ERROR,
  
    AQ,
    AQ_SUCCESS,
    AQ_ERROR,
  
    SP_QC_INIT,
    SP_QC_SUCCESS,
    SP_QC_ERROR,
  } from './constants';
  


  /**
* Sends a request to add to queue, this action starts the request saga
*
* @return {object} An action object with a type of SP_DETAIL_INIT
*/

export function qUp(ownerId, sp_id, tokenNo) {
    // console.log("ownerId, sp_id, tokenNo", ownerId, sp_id, tokenNo);
    return {
      type: QUP,
      ownerId,
      sp_id,
      tokenNo
    };
  }
  
  /**
   * Dispatched when add me to queue called
   *
   * @param  {string} payload The current sp_id and ownerId
   *
   * @return {object}      An action object with a type of SP_DETAIL_SUCCESS passing the payload
   */
  
  export function qUpSuccess(payload) {
    return {
      type: QUP_SUCCESS,
      payload,
    };
  }
  
  /**
   * Dispatched when adding to queue fails
   * @param  {object} error The error
   *
   * @return {object}       An action object with a type of SP_DETAIL_ERROR passing the error
   */
  export function qUpError(error) {
    return {
      type: QUP_ERROR,
      error,
    };
  }
  
  /**
  * Sends a request to remove from queue, this action starts the request saga
  *
  * @return {object} An action object with a type of SP_DETAIL_INIT
  */
  
  export function inQ(queueId, ownerId) {
    // console.log("ownerId, queueId", ownerId, queueId);
    return {
      type: INQ,
      queueId,
      ownerId,
  
    };
  }
  
  /**
   * Dispatched when add me to queue called
   *
   * @param  {string} payload The current sp_id and ownerId
   *
   * @return {object}      An action object with a type of SP_DETAIL_SUCCESS passing the payload
   */
  
  export function inQSuccess(payload) {
    return {
      type: INQ_SUCCESS,
      payload,
    };
  }
  
  /**
   * Dispatched when adding to queue fails
   * @param  {object} error The error
   *
   * @return {object}       An action object with a type of SP_DETAIL_ERROR passing the error
   */
  export function inQError(error) {
    return {
      type: INQ_ERROR,
      error,
    };
  }
  
  /**
  * Sends a request to check if user is in queue for this sp, this action starts the request saga
  *
  * @return {object} An action object with a type of SP_DETAIL_INIT
  */
  
  export function aQ(ownerId, sp_id) {
    // console.log("ownerId, sp_id", ownerId, sp_id);
    return {
      type: AQ,
      ownerId,
      sp_id,
  
  
    };
  }
  
  /**
   * Dispatched when activeQueue API called
   *
   * @param  {string} payload The current 
   *
   * @return {object}      An action object with a type of SP_DETAIL_SUCCESS passing the payload
   */
  
  export function aQuccess(payload) {
    return {
      type: AQ_SUCCESS,
      payload,
    };
  }
  
  /**
   * Dispatched when active queue api fails to fetch details
   * @param  {object} error The error
   *
   * @return {object}       An action object with a type of SP_DETAIL_ERROR passing the error
   */
  export function aQError(error) {
    return {
      type: AQ_ERROR,
      error,
    };
  }
  

  /**
* Sends a request to fetch sp current queue count, this action starts the request saga
*
* @return {object} An action object with a type of SP_DETAIL_INIT
*/

export function spQC(sp_id) {
  console.log("getting qc for sp_id", sp_id);
  return {
    type: SP_QC_INIT,
    sp_id,
  };
}

/**
 * Dispatched when queuecount API called
 *
 * @param  {string} payload The current 
 *
 * @return {object}      An action object with a type of SP_QUEUE_COUNT_SUCCESS passing the payload
 */

export function spQCSuccess(payload) {
  console.log("recvd success action qc count", payload);

  return {
    type: SP_QC_SUCCESS,
    payload,
  };
}

/**
 * Dispatched when fetching current queue count api fails to fetch details
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of SP_QUEUE_COUNT_ERROR passing the error
 */
export function spQCError(error) {
  return {
    type: SP_QC_ERROR,
    error,
  };
}

