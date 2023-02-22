/*
 * TPA Login Reducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {
    TPA_LOGIN_PAGE_INIT,
    TPA_LOGIN_ERROR,
    TPA_LOGIN_REQUESTING,
    TPA_LOGIN_SUCCESS,
} from './constants';

// The initial state of the App
export const initialState = {
    loading: false,
    error: false,
    successful: false,
    user: false,
};

/* eslint-disable default-case, no-param-reassign */
const TPALoginReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case TPA_LOGIN_PAGE_INIT:
                draft.error = false;
                break;

            case TPA_LOGIN_REQUESTING:
                draft.loading = true;
                break;

            case TPA_LOGIN_SUCCESS:
                draft.successful = true;
                draft.user = action.payload;
                draft.loading = false;
                break;

            case TPA_LOGIN_ERROR:
                draft.error = action.error;
                draft.successful = false;
                draft.loading = false;
                break;
        }
    });

export default TPALoginReducer;
