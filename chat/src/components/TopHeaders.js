import React, { Fragment, useState } from 'react'
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, Row, Col, NavItem } from 'reactstrap'
import brand from "../assets/img/brand.jpg"
import "../css/topHeader.css"
import { Bell, MoreVertical, Smile } from 'react-feather'

export default function TopHeaders() {

    const [isOpen, setisOpen] = useState(true)

    const toggle = () => {
        setisOpen(!isOpen)
    }
    return (
        <Fragment>

            <Navbar expand="md" light className='border-bottom border-2 px-0 mx-0 navbar'>
                <NavbarBrand className='brandDiv' href="/">
                    <img className='brand-logo' src={brand} />
                    <div >
                        <h1 style={{ lineHeight: 1.2 }} className='brand-name'>Arslan <br></br> Abdul Ghaffar</h1>
                    </div>
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse navbar isOpen={isOpen} >
                    <Nav className='me-auto' navbar style={{ backgroundColor: '' }}>
                        {/* {menu && <ParseMenu menu={menu} />} */}
                        {
                            // menu.length &&
                            <span className='className="d-block small opacity-50"'><i>You dont have any Menu please contact admin</i></span>

                        }
                    </Nav>
                    <Nav className='profileMenu'>

                        {/* <div className='profileMenu'> */}
                            <NavItem> <Bell style={{ marginRight: "20px" }} size={14} color='#fff' /></NavItem>
                            <NavItem><img className='brand-logo' src={brand} /></NavItem>
                            <NavItem><div className='profile-name'>
                                <h2 className=''>Arslan Ghaffar</h2>
                                <h2>Admin</h2>
                            </div></NavItem>
                            <NavItem> <MoreVertical size={14} color='#fff' /></NavItem>

                        {/* </div> */}
                    </Nav>

                </Collapse>
            </Navbar>
        </Fragment >
    )
}
