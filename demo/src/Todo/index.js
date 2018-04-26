import React from 'react';
import { Row, Col } from 'antd';
import Create from './components/Create';
import List from './components/List';

const Todo = props => {
    return (
        <Row style={{marginTop: 40}} type="flex" justify="center" >
            <Col span={12} >
                <Create />
                <div style={{marginTop: 20}}>
                <List />
                </div>
            </Col>
        </Row>
    );
};

export default Todo;
