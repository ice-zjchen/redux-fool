/**
* @file api middleware
* @author Ice(ice.zjchen@gmail.com)
*/
import { REQUEST, SUCCESS, FAILURE } from './constants';

export default function callAPIMiddleware({ dispatch, getState }) {
  return next => (action) => {
    const { type, payload = {} } = action;
    const { async = false, callAPI, shouldCallAPI = () => true } = action.meta || {};

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

    if (!shouldCallAPI(getState())) {
      return next(action);
    }

    const requestType = `${type}_${REQUEST}`;
    const successType = `${type}_${SUCCESS}`;
    const failureType = `${type}_${FAILURE}`;

    dispatch(Object.assign({}, { payload }, {
      type: requestType,
    }));

    return callAPI(payload)
      .then(response => (
        dispatch(Object.assign({}, {
          type: successType,
          payload: response,
          meta: {
            req: payload,
            res: response,
          },
        }))
      )).catch(error => (
        dispatch(Object.assign({}, {
          type: failureType,
          error,
          meta: {
            req: payload,
            error,
          },
        }))
      ));
  };
}
