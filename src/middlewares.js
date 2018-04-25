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

const getQuery = (state, selectQuerySet, paramsKey) => {
  const querySet = selectQuerySet(state);

  return querySet ? querySet[paramsKey] : null;
};

function callAPIMiddleware(opts) {
  const apiDataPath = opts ? opts.apiDataPath : null;
  const cache = new Map();

  return ({ dispatch, getState }) => next => (action) => {
    const { type, payload = {} } = action;
    const {
      async = false,
      callAPI,
      shouldCallAPI = () => true,
      once = false,
      selectQuerySet = () => null,
      concurrent = false,
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

    // deprecated
    if (!shouldCallAPI(getState(), action)) {
      return next(action);
    }

    const computedPayload = computeParams(payload);
    const paramsKey = JSON.stringify(computedPayload);

    const availableData = once && _.get(getQuery(getState(), selectQuerySet, paramsKey), 'response.data', null);
    if (availableData) {
      return Promise.resolve(availableData);
    }

    const requestKey = `${type}--${paramsKey}`;

    if (!concurrent) {
      const cachedPromise = cache.get(requestKey);

      if (cachedPromise) {
        return cachedPromise;
      }
    }

    const requestType = `${type}_${REQUEST}`;
    const successType = `${type}_${SUCCESS}`;
    const failureType = `${type}_${FAILURE}`;

    dispatch(Object.assign({}, {
      type: requestType,
      payload: computedPayload,
    }));

    const removeCachedPromise = () => {
      if (!concurrent) {
        cache.delete(requestKey);
      }
    };

    const handleResult = (response) => {
      removeCachedPromise();
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
          computedPayload,
          res,
        ),
      }));
    };

    const handleError = (error) => {
      removeCachedPromise();
      dispatch(Object.assign({}, {
        type: failureType,
        error,
        meta: createApiActionErrorMeta(computedPayload, error),
      }));

      throw error;
    };

    const promise = callAPI(payload)
      .then(handleResult)
      .catch(handleError);

    if (!concurrent) {
      cache.set(requestKey, promise);
    }

    return promise;
  };
}

export default callAPIMiddleware;
