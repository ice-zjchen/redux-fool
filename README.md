# redux-fool
## Install
```
npm install redux-tool --save
```

## Quick Start
### Create an API action
##### store.js
```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { middlewares as reduxFoolMiddlwares } from 'redux-fool';

import reducers from './reducers';

const apiMiddleware = reduxFoolMiddlwares.api;

export default (initialState) => {
  const applyMiddlewareFunc = applyMiddleware(thunk, apiMiddleware);

  const store = createStore(
    reducers,
    initialState,
    applyMiddlewareFunc,
  );

  return store;
};
```

##### actionTypes.js
```javascript
import { utils as reduxFoolUtils } from 'redux-fool';

const { defineActionType } = reduxFoolUtils;
const app = defineActionType('app');
const task = app('task');

export const CREATE_TASK = task('CREATE_TASK');

```

##### actions.js
```javascript
import { utils as reduxFoolUtils } from 'redux-fool';
import * as actionTypes from './actionTypes';
import request from './request';

const { makeAsyncActionCreator } = reduxFoolUtils;

const createTask = makeAsyncActionCreator(
  actionTypes.CREATE_TASK,
  data => request.post('api/task', data),
);
```

##### reducers.js
```javascript
import { handleActions } from 'redux-actions';
import * as actionTypes from './actionTypes';

const reducers = {
  ...createApiReducers(actionTypes.CREATE_TASK),
};
const initialState = {};

export default handleActions(reducers, initialState);
```

