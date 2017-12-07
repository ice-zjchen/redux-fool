/**
* @file utils
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
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

const createAsyncActionReducers = (
  actionType,
  successHandler = null,
  failureHanlder = null,
) => {
  if (!actionType || !_.isString(actionType)) {
    throw new Error('`actionType` is reqired string type for createAsyncActionReducers');
  }

  const type = _.camelCase(actionType.split('/').pop());

  const requestReducer = state => Object.assign({}, state, {
    [type]: {
      isFetching: true,
    },
  });
  const successReducer = (state, action) => Object.assign({}, state, {
    [type]: {
      isFetching: false,
      result: action.payload,
    },
  });
  const failureReducer = (state, action) => Object.assign({}, state, {
    [type]: {
      isFetching: false,
      error: action.error,
    },
  });

  return {
    [`${actionType}_${REQUEST}`]: requestReducer,
    [`${actionType}_${SUCCESS}`]: successHandler || successReducer,
    [`${actionType}_${FAILURE}`]: failureHanlder || failureReducer,
  };
};

export default {
  mapActionHandlers,
  defineActionType,
  makeActionCreator,
  makeAsyncActionCreator,
  createAsyncActionReducers,
};
