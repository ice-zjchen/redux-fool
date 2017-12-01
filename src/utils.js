/**
* @file utils
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { createAction as createReduxAction } from 'redux-actions';
import { REQUEST, SUCCESS, FAILURE } from './constants';

export const defineActionType = app => module => type => `${app}/${module}/${type}`;

export const makeActionCreator = (actionType, payload) => (
  createReduxAction(
    actionType,
    payload ? () => payload : updates => updates,
    () => ({ async: false }),
  )
);

export const makeAsyncActionCreator = (actionType, callAPI) => (
  createReduxAction(
    actionType,
    payload => payload,
    () => ({ async: true, callAPI}),
  )
);

export const createAsyncActonReducers = (actionType, successHandler = null, failureHanlder = null) => {
  if (!actionType) {
    throw new Error('`actionType` is reqired string type for createAsyncActonReducers');
  }

  const requestReducer = (state, action) => state;
  const successReducer = (state, action) => state;
  const failureReducer = (state, action) => state;

  return {
    [`${actionType}_${REQUEST}`]: requestReducer,
    [`${actionType}_${SUCCESS}`]: successHandler ? successHandler : successReducer,
    [`${actionType}_${FAILURE}`]: failureHanlder ? failureHanlder : failureReducer,
  };
};
