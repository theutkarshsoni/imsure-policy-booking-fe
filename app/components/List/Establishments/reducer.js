/*
 * EstablishmentReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {

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

// The initial state of the App
export const initialState = {
    loading: false,
    error: false,
    establishment: {
        service_providers: false,
    },
    AddToQueue: false,
    RemoveFromQueue: false,
    ActiveQ: false,
    SpQC: false
};

/* eslint-disable default-case, no-param-reassign */
const establishmentReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            // case SP_DETAIL_INIT:
            //     console.log("action", action);
            //     // Delete prefixed '@' from the github username
            //     draft.loading = true;
            //     draft.error = false;
            //     draft.establishment.service_providers = false;
            //     break;

            // case SP_DETAIL_SUCCESS:
            //     draft.establishment.service_providers = action.payload;
            //     draft.loading = false;
            //     break;

            // case SP_DETAIL_ERROR:
            //     draft.error = action.error;
            //     draft.loading = false;
            //     break;

            case QUP:
                draft.loading = true;
                draft.error = false;
                draft.AddToQueue = false;
                break;

            case QUP_SUCCESS:
                draft.AddToQueue = action.payload;
                draft.ActiveQ = true;
                draft.loading = false;
                break;

            case QUP_ERROR:
                draft.error = action.error;
                draft.loading = false;
                break;

            case INQ:
                draft.loading = true;
                draft.error = false;
                draft.RemoveFromQueue = false;
                break;

            case INQ_SUCCESS:
                draft.RemoveFromQueue = action.payload;
                draft.ActiveQ = false;
                draft.loading = false;
                break;

            case INQ_ERROR:
                draft.error = action.error;
                draft.loading = false;
                break;

            case AQ:
                draft.loading = true;
                draft.error = false;
                draft.ActiveQ = false;
                break;

            case AQ_SUCCESS:
                draft.ActiveQ = action.payload;
                draft.loading = false;
                console.log("active draft", draft.ActiveQ);
                break;

            case AQ_ERROR:
                draft.error = action.error;
                draft.loading = false;
                break;


            case SP_QC_INIT:
                draft.loading = true;
                draft.error = false;
                // draft.SpQC = false;
                break;

            case SP_QC_SUCCESS:
                console.log("recvd success in reducer", draft.spQC, action.payload);
                draft.SpQC = action.payload;
                draft.loading = false;
                break;

            case SP_QC_ERROR:
                draft.error = action.error;
                draft.loading = false;
                break;

        }
    });

export default establishmentReducer;
