/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSP = state => state.sc || initialState;

// const makeSelectSPDetails = () =>
//   createSelector(
//     selectSpDetails,
//     spdetailsState => spdetailsState.spDetails.service_providers,
//   );

/* Selector for adding to queue */

  const makeSelectAddToQueue = () =>
  createSelector(
    selectSP,
    addtoqueueState => addtoqueueState.AddToQueue,
  );

/* Selector for removing from queue */

  const makeSelectRemoveFromQueue = () =>
  createSelector(
    selectSP,
    removequeueState => removequeueState.RemoveFromQueue,
  );


  /* Selector for fetching is active queue*/

  const makeSelectActiveQ = () =>
  createSelector(
    selectSP,
    activequeueState => activequeueState.ActiveQ,
  );


  /* Selector for fetching sp queue count*/

  const makeSelectSpQC = () =>
  createSelector(
    selectSP,
    spqueueState => spqueueState.SpQC,
  );


export {

    selectSP,
//   makeSelectSPDetails,
  makeSelectAddToQueue,
  makeSelectRemoveFromQueue,
  makeSelectActiveQ,
  makeSelectSpQC,

};
