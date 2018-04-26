import utils from 'redux-fool/utils';

export const selectTodos = utils.createAsyncActionDataSelector(
    state => state.todo.getTodos,
    () => 'all'
);
