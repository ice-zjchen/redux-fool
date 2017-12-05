
import { utils } from 'redux-fool';
import * as actionTypes from './actionTypes';

const { handleActions, createAsyncActonReducers } = utils;

const reducers = {
  ...createAsyncActonReducers(actionTypes.CREATE_TASK),
};
const initialState = {};

export default handleActions(reducers, initialState);
