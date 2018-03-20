import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { middlewares as reduxFoolMiddlwares } from '../../src';

import reducers from './reducers';

const { callAPIMiddleware } = reduxFoolMiddlwares;

export default (initialState) => {
  const applyMiddlewareFunc = applyMiddleware(thunk, callAPIMiddleware());

  const store = createStore(
    reducers,
    initialState,
    applyMiddlewareFunc,
  );

  return store;
};
