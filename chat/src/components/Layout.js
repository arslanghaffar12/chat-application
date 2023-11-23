import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { Col, Container, Row, Spinner, Toast, ToastBody, ToastHeader } from 'reactstrap';
import TopHeaders from './TopHeaders';
import Sidebar from './Sidebar';
// import Footer from '../components/filters/components/Footer';
// import Loaders from '../components/Loaders';
// import Messages from '../components/Messages';
// import ConnectionLost from '../components/tables/ConnectionLost';
// import TopHeader from '../components/TopHeader';

const Layout = () => {
    const tag = "LAYOUT";
    return (
        <Fragment>
            <TopHeaders />
            {/* <Loaders />
            <Messages />
            <ConnectionLost/> */}
            <div className='container-fluid gx-0 gy-0' style={{backgroundColor : "#f7f7f7"}}>
                <Row className='m-0 p-0' >
                    <Col md={3} lg={2} className='m-0 p-0'>
                        <Sidebar     />
                    </Col>
                    <Col md={9} lg={10}>
                        <Outlet />

                    </Col>
                </Row>

            </div>


        </Fragment>
    )
}

export default Layout;