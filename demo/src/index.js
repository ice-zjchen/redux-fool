import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import reduxFool from 'redux-fool/index';

import todo from './Todo/model';
import App from './App';

const models = { todo };
const store = reduxFool.init({
    models,
    middlewares: window.__REDUX_DEVTOOLS_EXTENSION__ ? [window.__REDUX_DEVTOOLS_EXTENSION__()] : null
});

const Root = (
    <Provider store={store}>
        <App />
    </Provider>
);
ReactDOM.render(Root, document.getElementById('root'));

