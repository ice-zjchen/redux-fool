/**
* @file index
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { withDiff } from 'san-update';
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

const createRootReducer = (name, models) => {
  const allReducer = {
    entities: createTableUpdateReducer(),
  };

  _.each(models, (model, modelName) => {
    const genActionType = actionName => (
      defineActionType(name)(modelName)(toSnakeUpperCase(actionName))
    );
    // 生成reducers
    allReducer[modelName] = createModelReducer(genActionType, model);
  });

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

export const mergeReducers = (target, source) => {
  const reducers = _.reduce(source, (final, current, modelName) => {
    // san-update 浅合并
    const [merged, diff] = withDiff(final, { [modelName]: { $merge: current } });

    // 不允许相同命名的reducer，如果存在则抛出异常
    const d = _.keys(_.pickBy(diff[modelName], r => r.$change === 'change'));

    if (d.length) {
      throw new Error(`duplicate declaration of action \`${d[0]}\` in \`${modelName}\` scope`);
    }

    return merged;
  }, target);

  return reducers;
};

const configureStore = (initialState, rootReducer, middlewares = []) => {
  let applyMiddlewareFunc = applyMiddleware(thunk, callAPIMiddleware());

  if (middlewares) {
    applyMiddlewareFunc = compose(
      applyMiddlewareFunc,
      ...middlewares,
    );
  }

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

  let rootReducer = createRootReducer(name, models);
  rootReducer = mergeReducers(rootReducer, reducers);

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
