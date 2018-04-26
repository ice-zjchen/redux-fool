import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {middlewares, utils} from '../../src/index';

import todoModel from './Todo/components/model';

const { callAPIMiddleware } = middlewares;
const { createAsyncActionReducers } = utils;
models = {
    todo: {}
}
function init(models, opts) {
    const { state = {}, middlewares } = opts;
    // 
    for (const modelName of Object.keys(models)) {
        const model = models[modelName];

        // 创建rootReducers
        createReducers(model)
    }
}

const createReducers = (model) => {
    const { state, requests, handlers } = model;
    const reducers = {};
const reducers = {
    ...createAsyncActionReducers(actionTypes.GET_VIEW_ELEMENT_LIST),
    ...createAsyncActionReducers(actionTypes.GET_INDUSTRY_LIST),
    ...createAsyncActionReducers(actionTypes.GET_VIEW_ELEMENT_PERMISSION)
};
}

export default initialState => {
    let applyMiddlewareFunc = applyMiddleware(thunk, callAPIMiddleware());
    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
        applyMiddlewareFunc = compose(
            applyMiddlewareFunc,
            window.__REDUX_DEVTOOLS_EXTENSION__()
        );
    }
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddlewareFunc
    );

    return store;
};