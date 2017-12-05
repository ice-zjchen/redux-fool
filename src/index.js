/**
* @file index
* @author Ice(ice.zjchen@gmail.com)
*/
import * as allUtils from './utils';
import apiMiddleware from './apiMiddleware';

export const utils = allUtils;
export const middlewares = { api: apiMiddleware };

export default {
  utils,
  middlewares,
};
