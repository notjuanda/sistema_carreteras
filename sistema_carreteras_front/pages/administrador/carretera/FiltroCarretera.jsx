/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const FiltroCarretera = ({ onFilter }) => {
    const [filterText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filterText);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="align-items-center">
                <Col xs="auto">
                    <Form.Label htmlFor="municipioFilter" className="me-sm-2">
                        Filtrar por Municipio (texto):
                    </Form.Label>
                </Col>
            </Row>
        </Form>
    );
};

export default FiltroCarretera;
