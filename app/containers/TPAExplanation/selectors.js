/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectTPAExplanation = state => state.tpaExplanation || initialState;

const makeSelectTPAExplanation = () =>
    createSelector(
        selectTPAExplanation,
        tpaExplanationState => tpaExplanationState.claim
    );

export {
    selectTPAExplanation,
    makeSelectTPAExplanation,
};
