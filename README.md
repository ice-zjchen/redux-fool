# redux-fool

[![npm version](https://badge.fury.io/js/redux-fool.svg)](https://badge.fury.io/js/redux-fool)

It is a very simple tool, even fool, to creating a async action for redux. 


## Install
```
npm install redux-tool --save
```

## Quick Start

##### index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { init } from 'redux-fool';

import todo from './models/todo';

const models = { todo };
const store = init({
  models,
  middlewares: window.__REDUX_DEVTOOLS_EXTENSION__ ? [window.__REDUX_DEVTOOLS_EXTENSION__()] : null
});

const Root = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));

```

##### model.js
```javascript
import { utils as reduxFoolUtils } from 'redux-fool';

const { defineActionType } = reduxFoolUtils;
const app = defineActionType('app');
const task = app('task');

export const CREATE_TASK = task('CREATE_TASK');

```


## How fool it is?
By default, one action maps one object in state.

```json
{
  "moduleName": {
    "actionName": {
      "query": {
        "pendingMetux": 0,
        "response": {
          "params": {},
          "data": {},
          "error": {}
        }
      }
    }
  }
}
```

For example, In the ```task``` business module, If you create an api action named ``` CREATE_USER ```, the middleware will dispatch ``` CREATE_USER_REQUEST ```, ``` CREATE_USER_SUCCESS ``` or ``` CREATE_USER_FAILURE ```. Then default reducers update the ```createUser``` (camelCase of ```CREATE_USER```) in state.

a. dispacth **REQUEST**
```json
{
  "task": {
    "createTask": {
      "{\"taskName\":\"take a rest\"}": {
        "pendingMetux": 1
      }
    }
  }
}
```

b1. dispatch **SUCCESS**
```json
{
  "task": {
    "createTask": {
      "{\"taskName\":\"take a rest\"}": {
        "pendingMetux": 0,
        "response": {
          "params": {
            "taskName": "take a rest"
          },
          "data": {
            "taskId": "xxxx-xxxx-xxxx-xxxx"
          }
        }
      }
    }
  }
}
```

b2. dispatch **FALIURE**
```json
{
  "task": {
    "createTask": {
      "{\"taskName\":\"take a rest\"}": {
        "pendingMetux": 0,
        "response": {
          "params": {
            "taskName": "take a rest"
          },
          "error": {
            "message": "Access Denied"
          }
        }
      }
    }
  }
}
```
