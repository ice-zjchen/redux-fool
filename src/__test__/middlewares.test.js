/**
* @file api middleware test
* @author Ice(chenzhouji@baidu.com)
*/
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import test from 'ava';
import callAPIMiddleware from '../middlewares';
import utils from '../utils';
import { REQUEST, SUCCESS, FAILURE } from '../constants';

const { makeAsyncActionCreator } = utils;
const mockStore = configureMockStore([thunk, callAPIMiddleware({ apiDataPath: 'result' })]);
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
  const data = { userId: '007' };
  const callAPI = query => Promise.resolve(query).then(() => ({ result: data }));
  const createUser = makeAsyncActionCreator(actionType, callAPI);

  const expectedActions = [{
    payload: params,
    type: `${actionType}_${REQUEST}`,
  },
  {
    type: `${actionType}_${SUCCESS}`,
    payload: data,
    meta: { params, data },
  }];

  const store = mockStore({});
  await store.dispatch(createUser(params));

  const actions = store.getActions();
  delete actions[1].meta.arrivedAt;

  t.deepEqual(actions, expectedActions);
});

test('dispatch failure action', async (t) => {
  const params = { userName: 'new user' };
  const error = new Error('new error');
  const callAPI = query => Promise.resolve(query).then(() => Promise.reject(error));
  const createUser = makeAsyncActionCreator(actionType, callAPI);

  const expectedActions = [{
    payload: params,
    type: `${actionType}_${REQUEST}`,
  },
  {
    type: `${actionType}_${FAILURE}`,
    error,
    meta: { params, error: { message: error.message, ...error } },
  }];

  const store = mockStore({});
  try {
    await store.dispatch(createUser(params));
  } catch (err) {
    const actions = store.getActions();
    delete actions[1].meta.arrivedAt;

    t.deepEqual(actions, expectedActions);
  }
});
