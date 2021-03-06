# redux-fool

[![npm version](https://badge.fury.io/js/redux-fool.svg)](https://badge.fury.io/js/redux-fool)

**New APIs in v0.4.**

It is compatibile with [v0.3.x](https://github.com/ice-zjchen/redux-fool/tree/0.3.4) action/reducer declaration.


## Install
```
npm install redux-tool --save
```

## How fool it is?
1. Provide a good practice of global state design referred to [standard-redux-shape](https://github.com/ecomfe/standard-redux-shape#standard-shape-of-store).
2. Replace actionType + action + reducer with simple `model` configure.


## Quick Start

##### index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { init } from 'redux-fool';

import todo from './models/todo';
import todoReducers from './reducers/todo';

const models = { todo };

// compatible with v0.3
const reducers = { todo: todoReducers };

const store = init({
  name: 'myApp',
  models,
  reducers,
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
import * as request from '../request';
import _ from 'lodash';

const todo = {
    state: {},  // initial state

    // configure async actions
    requests: {
        getTodos: {
            // a Promise, usually a api call 
            fetch: query => request.getTodos(query),

            // advanced configs, refer to https://github.com/ice-zjchen/redux-fool/blob/master/docs/utils.md#makeAsyncActionCreator
            withTableUpdate: {
                tableName: 'todoById',
                selectEntities: res => ({ [res.uuid]: res }),
            },
            computeParams: () => 'all',
            cocurrent: false,
            once: false,
            selectQuerySet: () => null,
        }
    },

    // configure reducers of sync actions
    handlers: {
        toggleTodo: (state, { payload }) => {

            // do something here

            return state;
        },
    },
};

export default todo;

```
##### List.js
```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';

import todoActions from './actions/todo';

class List extends Component {
    retrieveTodos = () => {
        // dispatch action
        this.props.actions.getTodos();
    }

    render() {
        <a onClick={this.retrieveTodos}>
            Retrieve All Todos
        </a>
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
    actions: {
        ...dispatch.todo,  // actions in `dispatch` object
        ...todoActions  // compatible with v0.3
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List);

```
