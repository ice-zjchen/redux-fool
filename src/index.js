/**
* @file index
* @author Ice(ice.zjchen@gmail.com)
*/
import * as utils from './utils';
import apiMiddleware from './apiMiddleware';

export default {
  utils,
  middlewares: { api: apiMiddleware },
};
