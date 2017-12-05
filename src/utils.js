/**
* @file utils
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { createAction } from 'redux-actions';
import { REQUEST, SUCCESS, FAILURE } from './constants';

export const defineActionType = app => module => type => `${app}/${module}/${type}`;

export const makeActionCreator = (actionType, payload, meta = {}) => (
  createAction(
    actionType,
    payload ? () => payload : updates => updates,
    () => Object.assign({}, meta, { async: false }),
  )
);

export const makeAsyncActionCreator = (actionType, callAPI, meta = {}) => (
  createAction(
    actionType,
    payload => payload,
    () => Object.assign({}, meta, { async: true, callAPI }),
  )
);

export const createAsyncActonReducers = (
  actionType,
  successHandler = null,
  failureHanlder = null,
) => {
  if (!actionType || !_.isString(actionType)) {
    throw new Error('`actionType` is reqired string type for createAsyncActonReducers');
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
