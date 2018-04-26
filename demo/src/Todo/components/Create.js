import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { connect } from 'react-redux';

class Create extends Component {
    doSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
            if (err) {
                return;
            }

            this.props.actions.addTodo(value);
        })
    }

    retrieveTodos = () => {
        this.props.actions.getTodos();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form
                layout="inline"
                onSubmit={this.doSubmit}
            >
                <Form.Item>
                    {getFieldDecorator('content', {
                        rules: [{ required: true, message: 'Please input content' }],
                    })(
                        <Input placeholder="TODO"/>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >Add</Button>
                    <Button onClick={this.retrieveTodos}>
                        Retrieve Todos
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}
const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
    actions: dispatch.todo,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Create));
