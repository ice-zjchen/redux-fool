/**
* @file api middleware
* @author Ice(ice.zjchen@gmail.com)
*/
import _ from 'lodash';
import { REQUEST, SUCCESS, FAILURE, UPDATE_ENTITY_TABLE } from './constants';

const createApiActionMeta = (params, data) => ({
  arrivedAt: Date.now(),
  params,
  data,
});

const createApiActionErrorMeta = (params, error) => ({
  arrivedAt: Date.now(),
  params,
  error: { message: error.message, ...error },
});

function callAPIMiddleware(opts) {
  const apiDataPath = opts ? opts.apiDataPath : null;
  return ({ dispatch, getState }) => next => (action) => {
    const { type, payload = {} } = action;
    const {
      async = false,
      callAPI,
      shouldCallAPI = () => true,
      computeParams = params => params,
      withTableUpdate = {},
    } = action.meta || {};

    if (!async) {
      // Normal action: pass it on
      return next(action);
    }

    if (typeof type !== 'string') {
      throw new Error('Expected `type` is string.');
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.');
    }

    if (!shouldCallAPI(getState(), action)) {
      return next(action);
    }

    const requestType = `${type}_${REQUEST}`;
    const successType = `${type}_${SUCCESS}`;
    const failureType = `${type}_${FAILURE}`;

    dispatch(Object.assign({}, { payload }, {
      type: requestType,
    }));

    return callAPI(payload)
      .then((response) => {
        const res = !apiDataPath ? response : _.get(response, apiDataPath);

        if (_.has(withTableUpdate, 'tableName') && _.has(withTableUpdate, 'selectEntities')) {
          dispatch(Object.assign({}, {
            type: UPDATE_ENTITY_TABLE,
            payload: {
              tableName: withTableUpdate.tableName,
              entities: withTableUpdate.selectEntities(res),
            },
          }));
        }

        return dispatch(Object.assign({}, {
          type: successType,
          payload: res,
          meta: createApiActionMeta(
            computeParams(payload),
            res,
          ),
        }));
      })
      .catch(error => (
        dispatch(Object.assign({}, {
          type: failureType,
          error,
          meta: createApiActionErrorMeta(computeParams(payload), error),
        }))
      ));
  };
}

export default {
  callAPIMiddleware,
};
