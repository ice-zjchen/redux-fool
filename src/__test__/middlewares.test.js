/**
* @file api middleware test
* @author Ice(chenzhouji@baidu.com)
*/
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import test from 'ava';
import middlewares from '../middlewares';
import utils from '../utils';
import { REQUEST, SUCCESS, FAILURE } from '../constants';

const { makeAsyncActionCreator } = utils;
const mockStore = configureMockStore([thunk, middlewares.callAPIMiddleware]);
const actionType = 'CREATE_USER';

test('`callAPI` is function', (t) => {
  const callAPI = '';
  const action = makeAsyncActionCreator(actionType, callAPI);
  t.throws(() => {
    mockStore.dispatch(action());
  }, Error);
});

test('`type` is string', (t) => {
  const type = () => {};
  const callAPI = () => {};
  const action = makeAsyncActionCreator(type, callAPI);
  t.throws(() => {
    mockStore.dispatch(action());
  }, Error);
});

test('dispatch success action', async (t) => {
  const params = { userName: 'new user' };
  const callAPI = data => Promise.resolve(data).then(res => ({ result: res }));
  const createUser = makeAsyncActionCreator(actionType, callAPI);

  const expectedActions = [{
    payload: params,
    type: `${actionType}_${REQUEST}`,
  },
  {
    type: `${actionType}_${SUCCESS}`,
    payload: { result: params },
    meta: { req: params, res: { result: params } },
  }];

  const store = mockStore({});
  await store.dispatch(createUser(params));

  t.deepEqual(store.getActions(), expectedActions);
});


test('dispatch failure action', async (t) => {
  const params = { userName: 'new user' };
  const err = new Error('new error');
  const callAPI = data => Promise.resolve(data).then(() => Promise.reject(err));
  const createUser = makeAsyncActionCreator(actionType, callAPI);

  const expectedActions = [{
    payload: params,
    type: `${actionType}_${REQUEST}`,
  },
  {
    type: `${actionType}_${FAILURE}`,
    error: err,
    meta: { req: params, error: err },
  }];

  const store = mockStore({});
  await store.dispatch(createUser(params));

  t.deepEqual(store.getActions(), expectedActions);
});
