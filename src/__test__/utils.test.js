/**
* @file utils.test.js
* @author Ice(chenzhouji@baidu.com)
*/
import _ from 'lodash';
import test from 'ava';
import { REQUEST, SUCCESS, FAILURE } from '../constants';
import utils from '../utils';

test('`defineActionType` is ok', (t) => {
  const actionType = utils.defineActionType('app')('user')('GET_CURRENT_USER');
  const expectValue = 'app/user/GET_CURRENT_USER';
  t.is(actionType, expectValue);
});

test('`makeActionCreator` is ok', (t) => {
  t.plan(2);

  const actionType = 'ADD_TODO';
  const payload = { name: 'sleep' };
  const actionCreator = utils.makeActionCreator(actionType);

  const actionA = utils.makeActionCreator(actionType, payload)();
  const actionB = actionCreator(payload);
  const expect = {
    type: actionType,
    payload,
    meta: { async: false },
  };

  t.deepEqual(actionA, expect);
  t.deepEqual(actionB, expect);
});

test('`makeAsyncActionCreator` is ok', (t) => {
  const actionType = 'INCREMENT';
  const payload = { count: 1 };
  const callAPI = () => {};
  const actionCreator = utils.makeAsyncActionCreator(actionType, callAPI);

  const action = actionCreator(payload);

  const expect = {
    type: actionType,
    payload,
    meta: {
      async: true,
      callAPI,
    },
  };

  t.deepEqual(action, expect);
});

test('actionType sholud be string type in `createAsyncActionReducers`', (t) => {
  t.plan(2);

  const errMsg = '`actionType` is reqired string type for createAsyncActionReducers';
  const error = t.throws(() => {
    utils.createAsyncActionReducers();
  }, Error);

  t.is(error.message, errMsg);
});

test('`createAsyncActionReducers` default handlers is ok', (t) => {
  const actionType = 'IMCREMNET';
  const reducers = utils.createAsyncActionReducers(actionType);
  const expect = [
    `${actionType}_${REQUEST}`,
    `${actionType}_${SUCCESS}`,
    `${actionType}_${FAILURE}`,
  ];
  t.deepEqual(_.keys(reducers), expect);
});

test('`createAsyncActionReducers` custom handlers is ok', (t) => {
  t.plan(2);

  const success = () => true;
  const failure = () => false;
  const actionType = 'IMCREMNET';
  const reducers = utils.createAsyncActionReducers(actionType, success, failure);

  t.is(reducers[`${actionType}_${SUCCESS}`], success);
  t.is(reducers[`${actionType}_${FAILURE}`], failure);
});
