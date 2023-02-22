/**
 * Gets the repositories of the user from Github
 */
import { call, put, takeLatest } from 'redux-saga/effects';
import { QUP, INQ, AQ, SP_QC_INIT } from './constants';
import { qUpSuccess, qUpError, inQSuccess, inQError, aQuccess, aQError, spQCSuccess, spQCError } from './actions';

import request from '../../../utils/request';
// import { makeSelectSPList } from './selectors';
import { urls } from '../../../config/urls';
import { browserRedirect } from '../../../helpers/helpers';

/** API calls */
// function shopDetailCall(id) {
//   return request('get', urls.SHOP_DETAIL_URL + '/' + id);
// }

function addMeQueueCall(payload) {
  console.log("addMeQueueCall", payload);
  var queueObj = {}

  queueObj.sc_id = payload.ownerId;
  queueObj.sc_id = payload.sp_id;
  queueObj.token_no = payload.tokenNo;

  return request('post', urls.ADD_ME_QUEUE, queueObj);

}


function activeQueueCall(payload) {
  // console.log("activeQueueCall", payload);
  var activequeueObj = {};
  activequeueObj.sc_id = payload.ownerId;
  activequeueObj.sc_id = payload.sp_id;

  return request('post', urls.ACTIVE_QUEUE, activequeueObj);

}

function removeMeQueueCall(payload) {
  console.log("removeMeQueueCall", payload);
  var queueObj = {}
  queueObj.queue_id = payload.queueId;
  queueObj.sc_id = payload.ownerId;

  // queueObj.token_no = payload.token_no;

  return request('post', urls.REMOVE_ME_QUEUE, queueObj);

}


function shopQueueCountCall(payload) {
  var queueObj = {}
  queueObj.sc_id = payload.sp_id;
  console.log("payload to be sent for queue count", queueObj)
  // queueObj.token_no = payload.token_no;

  return request('post', urls.QUEUE_COUNT_URL, queueObj);
}



/**
 * Github repos request/response handler
 */
// export function* getSPDetails(payload) {
//   console.log("id at saga", payload.sp_id);

//   try {
//     let response = yield call(shopDetailCall, payload.sp_id);
//     response = response.data.data;
//     console.log("recvd resp", response);
//     yield put(spDetailsSuccess(response));
//   } catch (err) {
//     yield put(spDetailsError(err.response.data.data));
//   }
// }

/*Add me to queue saga*/

export function* addMeQueue(payload) {
  console.log("addMeQueueCall", payload);
  try {
    let response = yield call(addMeQueueCall, payload);
    response = response.data.data;
    console.log("recvd resp when added to queue", response);
    yield put(qUpSuccess(response));
    yield call(browserRedirect, '/account'); //temp redirection
  } catch (err) {
    yield put(qUpError(err.response.data.data));
  }

}

/* Remove me from queue saga*/

export function* removeMeQueue(payload) {
  console.log("removeMeQueueeCall", payload);

  try {
    let response = yield call(removeMeQueueCall, payload);
    response = response.data.data;
    console.log("recvd resp when removed from queue", response);
    yield put(inQSuccess(response));
    yield call(browserRedirect, '/account'); //redirection
  } catch (err) {
    yield put(inQError(err.response.data.data));
  }
}


/* Fetch active from queue saga*/

export function* activeQueue(payload) {

  try {
    let response = yield call(activeQueueCall, payload);
    response = response.data.data;
    console.log("recvd resp active queue", response);
    yield put(aQuccess(response));
  } catch (err) {
    yield put(aQError(err.response.data.data));
  }
}

/* Fetch queue count from queue saga*/

export function* spQC(payload) {

  try {
    console.log("recvd payload for shop queue count 1", payload);
    
    let response = yield call(shopQueueCountCall, payload);
    console.log("recvd resp for shop queue count 1", response);

    response = response.data.data;
    console.log("recvd resp for shop queue count", response);
    yield put(spQCSuccess(response));
  } catch (err) {
    yield put(spQCError(err.response.data.data));
  }

}



/**
 * Root saga manages watcher lifecycle
 */
export default function* spDetailsData(payload) {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  //   yield takeLatest(SP_DETAIL_INIT, getSPDetails),
  // yield takeLatest(QUP, addMeQueue),
  //   yield takeLatest(INQ, removeMeQueue),
  //   yield takeLatest(AQ, activeQueue),
  yield takeLatest(SP_QC_INIT, spQC)
}
