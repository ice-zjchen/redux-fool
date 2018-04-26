import * as request from '../request';
import _ from 'lodash';

// 同步的action创建、异步的reducer处理，能抽象到底层redux-fool，使得在业务开发时可以省略编码
const todo = {
    // 初始state
    state: {},

    // 异步action的actions
    requests: {
        addTodo: {
            fetch: query => request.addTodo(query),
            withTableUpdate: {
                tableName: 'todoById',
                selectEntities: res => ({ [res.uuid]: res }),
            }
        },
        getTodos: {
            fetch: query => request.getTodos(query),
            computeParams: () => 'all'
        }
    },

    // 同步action的reducers
    handlers: {
        toggleTodo: (state, { payload }) => {
            // 仅仅是例子，实际项目中这种写法是bad case
            console.log('...', state)
            const todos = state.getTodos[JSON.stringify('all')].response.data;

            const newTodos = _.map(todos, todo => {
                if (todo.uuid === payload) {
                    return {...todo, done: !todo.done};
                }
                return todo;
            });

            state.getTodos[JSON.stringify('all')].response.data = newTodos;

            return Object.assign({}, state);
        },
    },
};

export default todo;
