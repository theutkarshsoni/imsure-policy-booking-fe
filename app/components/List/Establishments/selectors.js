/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEstablishment = state => state.establishment || initialState;

// const makeSelectSPDetails = () =>
//   createSelector(
//     selectSpDetails,
//     spdetailsState => spdetailsState.spDetails.service_providers,
//   );

/* Selector for adding to queue */

  const makeSelectAddToQueue = () =>
  createSelector(
    selectEstablishment,
    addtoqueueState => addtoqueueState.AddToQueue,
  );

/* Selector for removing from queue */

  const makeSelectRemoveFromQueue = () =>
  createSelector(
    selectEstablishment,
    removequeueState => removequeueState.RemoveFromQueue,
  );


  /* Selector for fetching is active queue*/

  const makeSelectActiveQ = () =>
  createSelector(
    selectEstablishment,
    activequeueState => activequeueState.ActiveQ,
  );


  /* Selector for fetching sp queue count*/

  const makeSelectSpQC = () =>
  createSelector(
    selectEstablishment,
    spqueueState => spqueueState.SpQC,
  );


export {

    selectEstablishment,
//   makeSelectSPDetails,
  makeSelectAddToQueue,
  makeSelectRemoveFromQueue,
  makeSelectActiveQ,
  makeSelectSpQC,

};
