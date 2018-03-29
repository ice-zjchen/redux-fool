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


test('state is ok after default reducer call', (t) => {
  t.plan(4);

  const actionType = 'IMCREMNET';
  const params = { count: 1 };
  const params1 = { count: 2 };
  const data = { total: 2 };
  const error = new Error('no error');
  const reducers = utils.createAsyncActionReducers(actionType);

  const initState = {};
  const action0 = {
    type: `${actionType}_${REQUEST}`,
    payload: params,
  };

  const action1 = {
    type: `${actionType}_${SUCCESS}`,
    payload: { data },
    meta: { params, data },
  };

  const action2 = {
    type: `${actionType}_${REQUEST}`,
    payload: params1,
  };

  const action3 = {
    type: `${actionType}_${FAILURE}`,
    payload: { error },
    meta: { params: params1, error },
  };

  const state0 = {
    imcremnet: {
      '{"count":1}': {
        pendingMutex: 1,
      },
    },
    imcremnetParams: {
      count: 1,
    },
  };

  const state1 = {
    imcremnet: {
      '{"count":1}': {
        pendingMutex: 0,
        response: { params, data },
      },
    },
    imcremnetParams: {
      count: 1,
    },
  };

  const state2 = {
    imcremnet: {
      '{"count":1}': {
        pendingMutex: 0,
        response: { params, data },
      },
      '{"count":2}': {
        pendingMutex: 1,
      },
    },
    imcremnetParams: {
      count: 2,
    },
  };

  const state3 = {
    imcremnet: {
      '{"count":1}': {
        pendingMutex: 0,
        response: { params, data },
      },
      '{"count":2}': {
        pendingMutex: 0,
        response: { params: params1, error },
      },
    },
    imcremnetParams: {
      count: 2,
    },
  };

  let state = reducers[`${actionType}_${REQUEST}`](initState, action0);
  t.deepEqual(state, state0);

  state = reducers[`${actionType}_${SUCCESS}`](state, action1);
  t.deepEqual(state, state1);

  state = reducers[`${actionType}_${REQUEST}`](state, action2);
  t.deepEqual(state, state2);

  state = reducers[`${actionType}_${FAILURE}`](state, action3);
  t.deepEqual(state, state3);
});
