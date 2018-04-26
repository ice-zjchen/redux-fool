
const delay = time => new Promise(resolve => setTimeout(resolve, time));

let uuid = 0;

export const addTodo = query => {
    const result = { uuid, content: query.content, done: false };

    uuid ++;

    return delay(3000).then(() => result);
};


export const getTodos = () => {
    const result = [
        { uuid: 0, content: 'Sleep', done: false },
        { uuid: 1, content: 'Work', done: false },
        { uuid: 2, content: 'Play', done: true },
        { uuid: 3, content: 'Love', done: false },
        { uuid: 4, content: 'Fire', done: false },
    ];

    return delay(3000).then(() => result);
};
