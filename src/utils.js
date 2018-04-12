/**
* @file utils
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { set, immutable } from 'san-update';
import { createSelector } from 'reselect';
import { createAction, handleActions } from 'redux-actions';
import { REQUEST, SUCCESS, FAILURE } from './constants';
import entities from './entities';

// actions utils
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

// reducer utils
const reduceApiCallBy = reduceState => (state = {}, action) => {
  const stage = action.type.split('_').pop();

  const pendingMutexAddition = {
    [REQUEST]: 1,
    [SUCCESS]: -1,
    [FAILURE]: -1,
  };

  const cacheKey = JSON.stringify(stage === REQUEST ? action.payload : action.meta.params) || 'ALL';
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

// selector utils
const createAsyncActionSelector = (actionName, actionParams) => createSelector(
  [actionName, actionParams],
  (name, params) => {
    const paramsKey = JSON.stringify(params);
    return name[paramsKey];
  },
);

const get = name => source => (source == null ? source : source[name]);

const createAsyncActionResponseSelector = (actionName, actionParams) => createSelector(
  [createAsyncActionSelector(actionName, actionParams)],
  get('response'),
);

const createAsyncActionDataSelector = (actionName, actionParams) => createSelector(
  [createAsyncActionResponseSelector(actionName, actionParams)],
  get('data'),
);

const createAsyncActionErrorSelector = (actionName, actionParams) => createSelector(
  [createAsyncActionResponseSelector(actionName, actionParams)],
  get('error'),
);

export default {
  mapActionHandlers,
  defineActionType,
  makeActionCreator,
  makeAsyncActionCreator,
  createAsyncActionReducers,
  createAsyncActionResponseSelector,
  createAsyncActionDataSelector,
  createAsyncActionErrorSelector,
  ...entities,
};
