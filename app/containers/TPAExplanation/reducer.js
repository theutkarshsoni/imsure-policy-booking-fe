/*
 * TPA Explanation of Benifits Reducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {
    TPA_EXPLANATION_ERROR,
    TPA_EXPLANATION_REQUESTING,
    TPA_EXPLANATION_SUCCESS,
    TPA_CLAIM_STATUS_ERROR,
    TPA_CLAIM_STATUS_REQUESTING,
    TPA_CLAIM_STATUS_SUCCESS,
} from './constants';

// The initial state of the App
export const initialState = {
    loading: false,
    error: false,
    successful: false,
    claim: false,
    claimStatusResponse: false
};

/* eslint-disable default-case, no-param-reassign */
const TPAExplanationReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case TPA_EXPLANATION_REQUESTING:
                draft.loading = true;
                break;

            case TPA_EXPLANATION_SUCCESS:
                draft.successful = true;
                draft.claim = action.payload;
                draft.loading = false;
                break;

            case TPA_EXPLANATION_ERROR:
                draft.error = action.error;
                draft.successful = false;
                draft.loading = false;
                break;

            case TPA_CLAIM_STATUS_REQUESTING:
                draft.loading = true;
                break;

            case TPA_CLAIM_STATUS_SUCCESS:
                draft.successful = true;
                draft.claimStatusResponse = action.payload;
                draft.loading = false;
                break;

            case TPA_CLAIM_STATUS_ERROR:
                draft.error = action.error;
                draft.successful = false;
                draft.loading = false;
                break;
        }
    });

export default TPAExplanationReducer;
