/**
 * Gets the repositories of the user from Github
 */
import { put, all, call, takeLatest } from "redux-saga/effects";
import { TPA_EXPLANATION_REQUESTING, TPA_CLAIM_STATUS_REQUESTING } from './constants';
import {
    tpaExplanationSuccess,
    tpaExplanationError,
    tpaClaimStatusSuccess,
    tpaClaimStatusError
} from './actions';

import request from '../../utils/request';
import { urls } from '../../config/urls';

function tpaExplanationCall(payload) {
    return request('post', urls.TPA_PENDING_CLAIM_URL, payload);
}

function tpaClaimStatusCall(payload) {
    if (payload.status === 'approve')
        return request('post', urls.TPA_APPROVE_URL, payload);
    if (payload.status === 'override')
        return request('post', urls.TPA_OVERRIDE_APPROVE_URL, payload)
    if (payload.status === 'reject')
        return request('post', urls.TPA_REJECT_URL, payload);
}

export function* startTPAExplanation(payload) {
    console.log('tpa explanation payload', payload);
    try {
        // Call our request helper (see 'utils/request')
        let result = yield call(tpaExplanationCall, payload.payload);
        console.log('tpa explanation response', result.data.data);
        console.log('response type', typeof result.data.data);
        yield put(tpaExplanationSuccess(result.data.data));
    } catch (err) {
        console.log("TPA Explanation err", err);
        yield put(tpaExplanationError(err.response.data));
    }
}

export function* startTPAClaimStatus(payload) {
    console.log('tpa claim status payload', payload);
    try {
        // Call our request helper (see 'utils/request')
        let result = yield call(tpaClaimStatusCall, payload.payload);
        console.log('tpa claims status response', result.data.data);
        yield put(tpaClaimStatusSuccess(result.data.data));
    } catch (err) {
        console.log("TPA claims status err", err);
        yield put(tpaClaimStatusError(err.response.data));
    }
}


/**
 * Root saga manages watcher lifecycle
 */
export default function* TPAExplanation() {
    // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield all([
        takeLatest(TPA_EXPLANATION_REQUESTING, startTPAExplanation),
        takeLatest(TPA_CLAIM_STATUS_REQUESTING, startTPAClaimStatus),
    ]);

}
