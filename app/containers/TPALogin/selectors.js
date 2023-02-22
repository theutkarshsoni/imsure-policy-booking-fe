/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectTPALogin = state => state.tpaLogin || initialState;

const makeSelectTPALogin = () =>
    createSelector(
        selectTPALogin,
        tpaLoginState => tpaLoginState
    );

export {
    selectTPALogin,
    makeSelectTPALogin,
};
