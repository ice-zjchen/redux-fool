# redux-fool
It is a very simple tool, even fool, to creating a async action for redux. 

## Install
```
npm install redux-tool --save
```

## How fool it is?
By default, one action maps one object in state.

```json
{
  "moduleName": {
    "actionName": {
      "isFetching": false,
      "result": {},
      "error": {}
    }
  }
}
```

For example, In the ```task``` business module, If you create an api action named ``` CREATE_USER ```, the middleware will dispatch ``` CREATE_USER_REQUEST ```, ``` CREATE_USER_SUCCESS ``` or ``` CREATE_USER_FAILURE ```. Then default reducers update the ```createUser``` (camelCase of ```CREATE_USER```) in state.
```json
{
  "task": {
    "createTask": {
      "isFetching": false,
      "result": {},
      "error": {}
    }
  }
}
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
import { utils as reduxFoolUtils } from 'redux-fool';
import * as actionTypes from './actionTypes';

const { mapActionHandlers } = reduxFoolUtils;

const reducers = {
  ...createApiReducers(actionTypes.CREATE_TASK),
};
const initialState = {};

export default mapActionHandlers(reducers, initialState);
```
## Advanced Usage
Of course, you can handle success action or failure action yourself. It's also allow you to operate any state object limited in ```MODULE``` scope, such as ```state.task.entities```.
##### reducers.js
```javascript
import { utils as reduxFoolUtils } from 'redux-fool';
import * as actionTypes from './actionTypes';

const { mapActionHandlers } = reduxFoolUtils;

const successHandler = (state, action) => {...};
const failureHandler = (state, action) => {...};
const reducers = {
  ...createApiReducers(actionTypes.CREATE_TASK, successHandler, failureHandler),
};
const initialState = {};

export default mapActionHandlers(reducers, initialState);
