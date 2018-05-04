/**
* @file utils.test.js
* @author Ice(chenzhouji@baidu.com)
*/
import test from 'ava';
import { mergeReducers } from '../index';

test('throw error in `mergeReducers` is ok', (t) => {
  const target = {
    user: {
      getUserList: () => {},
    },
  };
  const source = {
    user: {
      getUserList: () => {},
    },
  };

  t.throws(() => {
    mergeReducers(target, source);
  }, Error);
});


test('throw error in `mergeReducers` is ok', (t) => {
  const target = {
    leads: {},
  };
  const source = {
    user: {
      getUserList: () => {},
    },
    task: {},
  };

  const expect = {
    user: {
      getUserList: () => {},
    },
    leads: {},
    task: {},
  };

  t.notDeepEqual(expect, mergeReducers(target, source));
});
