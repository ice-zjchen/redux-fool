/**
* @file entities
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { immutable } from 'san-update';
import { UPDATE_ENTITY_TABLE } from './constants';

const reduce = (object, iteratee, initialValue) => {
  const keys = Object.keys(object);
  return keys.reduce((result, key) => iteratee(result, object[key], key), initialValue);
};

/**
 * 请求结果在store中序列化的reducer，配合action中withTableUpdate配置使用
 *
 * @param {Function} nextReducer 后续处理的reducer
 */
const createTableUpdateReducer = (nextReducer = s => s) => (state = {}, action) => {
  if (action.type !== UPDATE_ENTITY_TABLE) {
    return nextReducer(state, action);
  }

  const { payload: { tableName, entities } } = action;

  if (!entities && !state[tableName]) {
    return { ...state, [tableName]: {} };
  }

  const table = state[tableName] || {};

  const merging = reduce(
    entities,
    (chain, value, key) => chain.merge([key], value), immutable(table),
  );
  const [mergedTable, diff] = merging.withDiff();
  const newState = _.isEmpty(diff) ? state : { ...state, [tableName]: mergedTable };

  return nextReducer(newState, action);
};

export default {
  createTableUpdateReducer,
};
