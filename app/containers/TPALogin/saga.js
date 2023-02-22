/**
 * Gets the repositories of the user from Github
 */
import { put, all, call, takeLatest } from "redux-saga/effects";
import jwtdecode from "jwt-decode";
import { TPA_LOGIN_REQUESTING } from './constants';
import {
    tpaLoginSuccess,
    tpaLoginError,
} from './actions';

import request from '../../utils/request';
import { urls } from '../../config/urls';
import { browserRedirect } from '../../helpers/helpers';


function tpaLoginCall(payload) {
    return request('post', urls.TPA_LOGIN_URL, payload);
}

export function* startTPALogin(payload) {
    console.log('tpa login payload', payload);
    try {
        // Call our request helper (see 'utils/request')
        let result = yield call(tpaLoginCall, payload.payload);
        console.log('tpa login response', result.data);
        result = result.data;
        let userObj = jwtdecode(result.data.token);
        console.log("userObj", userObj);
        if (userObj && userObj.role === 'TPA') {
            localStorage.removeItem('token');
            localStorage.setItem('token', result.data.token);
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(userObj));
            yield put(tpaLoginSuccess(result));
            yield call(browserRedirect, '/tpa/explanation');
        }
        else {
            
            yield put(tpaLoginError({ "e": { "error": "Not TPA" } }));
        }
    } catch (err) {
        console.log("TPA Login err", err);
        yield put(tpaLoginError(err.response.data));
    }
}


/**
 * Root saga manages watcher lifecycle
 */
export default function* TPALogin() {
    // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield all([
        takeLatest(TPA_LOGIN_REQUESTING, startTPALogin),
    ]);

}
