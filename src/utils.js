/**
* @file utils
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { set, immutable } from 'san-update';
import { createSelector } from 'reselect';
import { createAction, handleActions } from 'redux-actions';
import { REQUEST, SUCCESS, FAILURE } from './constants';
import entities from './entities';

/**
 * 组合多个reducers
 * @param {Object} reducers actionType和reducer的映射，<actionType, reducer>
 * @param {Object} initialState 初始state
 * @returns {Function} slice reducers
 */
const mapActionHandlers = (reducers, initialState) => handleActions(reducers, initialState);

/**
 * 定义actionType
 *
 * ```javascript
 * // app/module/ACTION_TYPE
 * defineActionType('app')('module')('ACTION_TYPE')
 * ```
 */
const defineActionType = app => module => type => `${app}/${module}/${type}`;

/**
 * 同步action构造器
 * @param {string} actionType action类型
 * @param {Object|Function} payload 参数
 * @param {Object} meta 配置
 */
const makeActionCreator = (actionType, payload, meta = {}) => (
  createAction(
    actionType,
    payload ? () => payload : updates => updates,
    () => Object.assign({}, meta, { async: false }),
  )
);

/**
 * @function makeAsyncActionCreator~shouldCallAPI
 * @param {Object} state 当前store中的state
 * @param {Object} action action对象
 * @returns {boolean} 是否调用API
 */
/**
 * 中间件将会执行selectQuerySet(state)得到结果池
 * ```
 * selectQuerySet = (state) => state.customer.getCustomerList
 * ```
 * 在根据请求的参数stringify后的paramsKey，从结果池中获取所要的结果
 * @function makeAsyncActionCreator~selectQuerySet
 * @param {Object} state 当前store中的state
 * @returns {Object} 根据paramsKey获取的结果
 */
/**
 * @function makeAsyncActionCreator~withTableUpdate
 * @param {Object} tableName - 表名，即entities[tableName]
 * @param {function(object):object} selectEntities - 根据传入的返回数据data，给出最终normalizr的结果
 */
/**
 * 异步action构造器
 * @param {string} actionType - action类型
 * @param {Function} callAPI - api请求promise
 * @param {Object} meta - 配置
 * @param {boolean} meta.async=true - 是否异步
 * @param {makeAsyncActionCreator~shouldCallAPI} meta.shouldCallAPI - 是否调用API
 * @param {boolean} meta.once=false - 同一请求（路径+参数）仅调用一次，必须提供参数`selectQuerySet`
 * @param {makeAsyncActionCreator~selectQuerySet} meta.selectQuerySet - API请求的结果池
 * @param {boolean} meta.cocurrent=false - 是否并发，默认为false，pendingMutex为1时不会发出请求
 * @param {makeAsyncActionCreator~withTableUpdate} meta.withTableUpdate - normalizr的配置
 */
const makeAsyncActionCreator = (actionType, callAPI, meta = {}) => (
  createAction(
    actionType,
    payload => payload,
    () => Object.assign({}, meta, { async: true, callAPI }),
  )
);


// reducer utils
const reduceApiCallBy = reduceState => (state = {}, action) => {
  const stage = action.type.split('_').pop();

  const pendingMutexAddition = {
    [REQUEST]: 1,
    [SUCCESS]: -1,
    [FAILURE]: -1,
  };

  const cacheKey = JSON.stringify(stage === REQUEST ? action.payload : action.meta.params) || 'ALL';
  const cacheItem = state[cacheKey] || { pendingMutex: 0 };

  const nextPendingMutex = cacheItem.pendingMutex + pendingMutexAddition[stage];
  const newItem = nextPendingMutex === cacheItem.pendingMutex
    ? cacheItem
    : { ...cacheItem, pendingMutex: nextPendingMutex };

  return {
    ...state,
    [cacheKey]: reduceState(newItem, stage, action.meta),
  };
};

const alwaysOverride = (item, stage, response) => {
  if (stage === SUCCESS || stage === FAILURE) {
    return { ...item, response };
  }

  return item;
};

/**
 * 异步action的reducers构造器
 * @param {string} actionType - actionType
 * @param {*} requestHandler - 自定义REQUEST处理函数
 * @param {*} successHandler - 自定义SUCCESS处理函数
 * @param {*} failureHanlder - 自定义FAILURE处理函数
 */
const createAsyncActionReducers = (
  actionType,
  requestHandler = null,
  successHandler = null,
  failureHanlder = null,
) => {
  if (!actionType || !_.isString(actionType)) {
    throw new Error('`actionType` is reqired string type for createAsyncActionReducers');
  }

  const type = _.camelCase(actionType.split('/').pop());

  const defaultReducer = (state = {}, action) => set(
    state,
    type,
    reduceApiCallBy(alwaysOverride)(state[type], action),
  );

  const requestReducer = (state = {}, action) => (
    immutable(state)
      .set(type, reduceApiCallBy(alwaysOverride)(state[type], action))
      .set(`${type}Params`, action.payload)
      .value()
  );

  return {
    [`${actionType}_${REQUEST}`]: requestHandler || requestReducer,
    [`${actionType}_${SUCCESS}`]: successHandler || defaultReducer,
    [`${actionType}_${FAILURE}`]: failureHanlder || defaultReducer,
  };
};

const createAsyncActionSelector = (actionName, actionParams) => createSelector(
  [actionName, actionParams],
  (name, params) => {
    const paramsKey = JSON.stringify(params);
    return name[paramsKey];
  },
);

const get = name => source => (source == null ? source : source[name]);

/**
 * 异步action返回结果（response）选择器的构造函数
 * @param {string} actionName action函数名
 * @param {Object} actionParams 请求参数
 */
const createAsyncActionResponseSelector = (actionName, actionParams) => createSelector(
  [createAsyncActionSelector(actionName, actionParams)],
  get('response'),
);

/**
 * 异步action返回数据（response.data）选择器的构造函数
 * @param {string} actionName action函数名
 * @param {Object} actionParams 请求参数
 */
const createAsyncActionDataSelector = (actionName, actionParams) => createSelector(
  [createAsyncActionResponseSelector(actionName, actionParams)],
  get('data'),
);

/**
 * 异步action返回错误（response.error）选择器的构造函数
 * @param {string} actionName action函数名
 * @param {Object} actionParams 请求参数
 */
const createAsyncActionErrorSelector = (actionName, actionParams) => createSelector(
  [createAsyncActionResponseSelector(actionName, actionParams)],
  get('error'),
);

export default {
  mapActionHandlers,
  defineActionType,
  makeActionCreator,
  makeAsyncActionCreator,
  createAsyncActionReducers,
  createAsyncActionResponseSelector,
  createAsyncActionDataSelector,
  createAsyncActionErrorSelector,
  ...entities,
};
