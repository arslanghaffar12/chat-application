import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { Col, Container, Row, Spinner, Toast, ToastBody, ToastHeader } from 'reactstrap';
// import Footer from '../components/filters/components/Footer';
// import Loaders from '../components/Loaders';
// import Messages from '../components/Messages';
// import ConnectionLost from '../components/tables/ConnectionLost';
// import TopHeader from '../components/TopHeader';

const Layout = () => {
    const tag = "LAYOUT";
    return (
        <Fragment>
            {/* <TopHeader/>
            <Loaders />
            <Messages />
            <ConnectionLost/> */}
            <Container>
                <Row>
                    <Col className='py-3'>
                        <Outlet />
                        {/* <Footer/> */}
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}

export default Layout;