/**
* @file index
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import utils from './utils';
import callAPIMiddleware from './middlewares';

const {
  defineActionType,
  createAsyncActionReducers,
  mapActionHandlers,
  createTableUpdateReducer,
  makeAsyncActionCreator,
  makeActionCreator,
} = utils;

const toSnakeUpperCase = str => _.snakeCase(str).toUpperCase();

const createModelReducer = (genActionType, model) => {
  const { requests, handlers } = model;

  const asyncReducers = _.reduce(requests, (reducers, request, actionName) => (
    _.merge(reducers, createAsyncActionReducers(genActionType(actionName)))
  ), {});

  const syncReducers = _.reduce(handlers, (reducers, handler, actionName) => (
    _.merge(reducers, { [genActionType(actionName)]: handler })
  ), {});

  return mapActionHandlers({ ...asyncReducers, ...syncReducers }, model.state);
};

export const mergeReducers = (target, source) => {
  const targetModelNames = _.keys(target);
  const sourceModelNames = _.keys(source);

  // 不允许有相同的model名字的情况
  const conflict = _.filter(sourceModelNames, name => (
    _.includes(targetModelNames, name)
  ));

  if (conflict.length) {
    throw new Error(`duplicate declaration of model scope \`${conflict[0]}\``);
  }

  return {
    ...target,
    ...source,
  };
};

const createRootReducer = (name, models, reducers) => {
  let allReducer = {
    entities: createTableUpdateReducer(),
  };

  _.each(models, (model, modelName) => {
    const genActionType = actionName => (
      defineActionType(name)(modelName)(toSnakeUpperCase(actionName))
    );
    // 生成reducers
    allReducer[modelName] = createModelReducer(genActionType, model);
  });
  allReducer = mergeReducers(allReducer, reducers);

  return combineReducers(allReducer);
};

const createModelAction = (appName, modelName, model, store) => {
  const { requests, handlers } = model;
  const actions = {};

  _.each(requests, (actionConfig, actionName) => {
    const actionType = defineActionType(appName)(modelName)(toSnakeUpperCase(actionName));
    const action = makeAsyncActionCreator(
      actionType,
      actionConfig.fetch,
      { ..._.omit(actionConfig, 'fetch') },
    );
    actions[actionName] = params => store.dispatch(action(params));
  });

  _.each(handlers, (handler, actionName) => {
    const actionType = defineActionType(appName)(modelName)(toSnakeUpperCase(actionName));
    const action = makeActionCreator(actionType);
    actions[actionName] = params => store.dispatch(action(params));
  });

  return actions;
};

const configureStore = (initialState, rootReducer, middlewares = []) => {
  let applyMiddlewareFunc = applyMiddleware(thunk, callAPIMiddleware(), ...middlewares);

  // 暂时允许一直开启dev-tool
  // if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {

  /* eslint-disable */
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    applyMiddlewareFunc = compose(
      applyMiddlewareFunc,
      window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
  /* eslint-enable */

  return createStore(
    rootReducer,
    initialState,
    applyMiddlewareFunc,
  );
};

function init(opts) {
  const {
    name = 'app',
    state = {},
    models,
    middlewares,
    reducers = {},
  } = opts;

  if (!models) {
    throw new Error('`models` is a required property');
  }

  const rootReducer = createRootReducer(name, models, reducers);

  const store = configureStore(state, rootReducer, middlewares);

  const actions = {};
  _.each(models, (model, modelName) => {
    actions[modelName] = createModelAction(name, modelName, model, store);
  });

  store.dispatch = _.merge(store.dispatch, actions);

  return store;
}

export {
  init,
  utils,
};

export default {
  init,
  utils,
};
