/**
* @file utils
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { createAction } from 'redux-actions';
import { REQUEST, SUCCESS, FAILURE } from './constants';

export const defineActionType = app => module => type => `${app}/${module}/${type}`;

export const makeActionCreator = (actionType, payload) => (
  createAction(
    actionType,
    payload ? () => payload : updates => updates,
    () => ({ async: false }),
  )
);

export const makeAsyncActionCreator = (actionType, callAPI) => (
  createAction(
    actionType,
    payload => payload,
    () => ({ async: true, callAPI }),
  )
);

export const createAsyncActonReducers = (actionType, successHandler = null, failureHanlder = null) => {
  if (!actionType || !_.isString(actionType)) {
    throw new Error('`actionType` is reqired string type for createAsyncActonReducers');
  }

  const requestReducer = (state, action) => Object.assign({}, state, {
    [actionType]: {
      isPending: true
    }
  });
  const successReducer = (state, action) => Object.assign({}, state, {
    [actionType]: {
      isPending: false,
      result: action.payload
    }
  });
  const failureReducer = (state, action) => Object.assign({}, state, {
    [actionType]: {
      isPending: false,
      error: action.error
    }
  });

  return {
    [`${actionType}_${REQUEST}`]: requestReducer,
    [`${actionType}_${SUCCESS}`]: successHandler || successReducer,
    [`${actionType}_${FAILURE}`]: failureHanlder || failureReducer,
  };
};
