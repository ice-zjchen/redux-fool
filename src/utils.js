/**
* @file utils
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { set, immutable } from 'san-update';
import { createAction, handleActions } from 'redux-actions';
import { REQUEST, SUCCESS, FAILURE } from './constants';

const mapActionHandlers = handleActions;

const defineActionType = app => module => type => `${app}/${module}/${type}`;

const makeActionCreator = (actionType, payload, meta = {}) => (
  createAction(
    actionType,
    payload ? () => payload : updates => updates,
    () => Object.assign({}, meta, { async: false }),
  )
);

const makeAsyncActionCreator = (actionType, callAPI, meta = {}) => (
  createAction(
    actionType,
    payload => payload,
    () => Object.assign({}, meta, { async: true, callAPI }),
  )
);

const reduceApiCallBy = reduceState => (state = {}, action) => {
  const stage = action.type.split('_').pop();

  const pendingMutexAddition = {
    [REQUEST]: 1,
    [SUCCESS]: -1,
    [FAILURE]: -1,
  };

  const cacheKey = JSON.stringify(stage === REQUEST ? action.payload : action.meta.params);
  const cacheItem = state[cacheKey] || { pendingMutex: 0 };

  const nextPendingMutex = cacheItem.pendingMutex + pendingMutexAddition[stage];
  const newItem = nextPendingMutex === cacheItem.pendingMutex
    ? cacheItem
    : { ...cacheItem, pendingMutex: nextPendingMutex };

  return {
    ...state,
    [cacheKey]: reduceState(newItem, stage, action.meta),
  };
};

const alwaysOverride = (item, stage, response) => {
  if (stage === SUCCESS || stage === FAILURE) {
    return { ...item, response };
  }

  return item;
};

const createAsyncActionReducers = (
  actionType,
  successHandler = null,
  failureHanlder = null,
) => {
  if (!actionType || !_.isString(actionType)) {
    throw new Error('`actionType` is reqired string type for createAsyncActionReducers');
  }

  const type = _.camelCase(actionType.split('/').pop());

  const defaultReducer = (state = {}, action) => set(
    state,
    type,
    reduceApiCallBy(alwaysOverride)(state[type], action),
  );

  const requestReducer = (state = {}, action) => (
    immutable(state)
      .set(type, reduceApiCallBy(alwaysOverride)(state[type], action))
      .set(`${type}Params`, action.payload)
      .value()
  );

  return {
    [`${actionType}_${REQUEST}`]: requestReducer,
    [`${actionType}_${SUCCESS}`]: successHandler || defaultReducer,
    [`${actionType}_${FAILURE}`]: failureHanlder || defaultReducer,
  };
};

export default {
  mapActionHandlers,
  defineActionType,
  makeActionCreator,
  makeAsyncActionCreator,
  createAsyncActionReducers,
};
