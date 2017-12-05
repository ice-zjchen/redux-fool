import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { middlewares as reduxFoolMiddlwares } from 'redux-fool';

import reducers from './reducers';

const apiMiddleware = reduxFoolMiddlwares.api;

export default (initialState) => {
  const applyMiddlewareFunc = applyMiddleware(thunk, apiMiddleware);

  const store = createStore(
    reducers,
    initialState,
    applyMiddlewareFunc,
  );

  return store;
};
