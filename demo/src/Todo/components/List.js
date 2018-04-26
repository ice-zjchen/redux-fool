import _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import { selectTodos } from '../selector';

class List extends Component {
    static defaultProps = {
        todos: []
    }

    columns = () => {
        return [{
            title: 'Todo',
            key: 'content',
            dataIndex: 'content',
        }, {
            title: 'Status',
            key: 'done',
            dataIndex: 'done',
            render: (text) => text ? 'DONE': 'TODO'
        }, {
            title: 'operation',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, row) => (
                <a onClick={() => { this.toggle(row.uuid); }}>{ !row.done ? 'Complete' : 'Undo' }</a>
            )
        }]
    }

    toggle = uuid => {
        this.props.actions.toggleTodo(uuid);
    }

    render() {
        return (
            <Table
                columns={this.columns()}
                dataSource={this.props.todos}
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => {

    return {
        ...ownProps,
        // bad case，应该使用selector
        todos: _.get(state, ['todo', 'getTodos', JSON.stringify('all'),'response', 'data'], [])
    };
};

const mapDispatchToProps = dispatch => ({
    actions: dispatch.todo
})

export default connect(mapStateToProps, mapDispatchToProps)(List)