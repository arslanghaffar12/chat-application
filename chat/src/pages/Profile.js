import React, { Fragment, useEffect, useState } from 'react'
import { Button, Card, Col, Input, Label, ListGroup, ListGroupItem, Row } from 'reactstrap'
import "../css/chat.css"
import "../css/profile.css"
import Password from 'antd/es/input/Password'
import { Bell, Briefcase, ChevronRight, Edit2, Shield } from 'react-feather'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ImageUploader from '../components/ImgaeUploader'
import { userUpdateRequest } from '../helpers/request'
import UpdatePassword from './profile/UpdatePassword'

export default function Profile() {

    const [route, setRoute] = useState(1)
    const user = useSelector(state => state.auth.user);
    const [imageData, setImageData] = useState([]);
    console.log('imageData==', imageData);
    const iconColor = "#969fb0"
    const colors = {
        primary: "#969fb0",
        active: "#504190"
    }

    const [member, setMember] = useState({})
    console.log('member');

    const onChangeValues = (e) => {
        let _member = { ...member, [e.target.name]: e.target.value }

        setMember(_member)

    }

    const save = () => {
        console.log('member====', member);
        let payload = {
            params : {_id : member._id},
            data: { ...member, image: imageData[0].thumbUrl },
            // dispatch
        }
        let response = userUpdateRequest(payload);
        console.log('response of creating user', response);
    }


    const password = () => {
        
    }



    const menu = [
        { id: 1, title: 'Edit Profile', icon: <Edit2 size={15} color={route === 1 ? colors.active : colors.primary} />, },
        { id: 2, title: 'Notification', icon: <Bell size={15} color={route === 2 ? colors.active : colors.primary} />, },
        { id: 3, title: 'Choose Plan', icon: <Briefcase size={15} color={route === 3 ? colors.active : colors.primary} />, },
        { id: 4, title: 'Password & Security', icon: <Shield size={15} color={route === 4 ? colors.active : colors.primary} />, },

    ]



    useEffect(() => {

        if (user) {
            let obj = {
                new: true,
                data: user.image,
                thumbUrl: user.image,
                name: 'Profile'
            }
            setImageData([obj])
            setMember(user)
        }

    }, [user])
    return (
        <Fragment>
            <Row className='p-0 m-0 my-4' >
                <Col md={3} lg={3} sm={3} className='p-0 m-0'>
                    <Card className='chat-card w-98 border-0'>
                        <div className='profile-sidebar'>
                            <ListGroup>
                                {menu.map((item, ind) => {
                                    return (

                                        <ListGroupItem key={ind} className='p-0 m-0 profile-list-item' >
                                            <div className='p-2 m-0' style={{ flex: '1 0 10%' }}>
                                                {item.icon}
                                            </div>

                                            <div className='d-flex p-2 m-1' style={{ flex: '1 0 80%' }}>
                                                <NavLink style={{ textDecoration: 'none' }} onClick={() => setRoute(item.id)}>
                                                    <h3 className='profile-title' style={{ color: route === item.id ? colors.active : colors.primary }}>
                                                        <span className='mx-2'>{item.title}</span>
                                                        {item.id === route && <ChevronRight size={15} color={colors.active} />}

                                                    </h3>

                                                </NavLink>
                                            </div>





                                        </ListGroupItem>
                                    )
                                })}
                            </ListGroup>






                        </div>

                    </Card>
                </Col>
                <Col md={9} lg={9} sm={9}>
                    <Card className='border-0 chat-card '>
                        {route === 1 && <Row>
                            <Col md={6} lg={6} sm={6}>

                                <div className='p-3 px-4'>
                                    <h4>Profile</h4>
                                    <div className='profile-pic-containert mt-3' >
                                        <ImageUploader
                                            listType={"picture-circle"}
                                            setImageData={(e) => setImageData(e)}
                                            imageData={imageData}
                                        />
                                        {/* <img src={user.image} style={{ height: "100%", borderRadius: "50%" }} /> */}


                                    </div>
                                    <Row className='mt-3'>
                                        <Col md={6} sm={6} lg={6}>
                                            <Label className='primary-text' >Name</Label>
                                            <Input className='input' type='text' name='name' defaultValue={member.name} onChange={(e) => onChangeValues(e)} />
                                        </Col>
                                        <Col md={6} sm={6} lg={6} >
                                            <Label className='primary-text'>Email</Label>
                                            <Input className='input' type='text' name='email' defaultValue={member.email} disabled={true} />

                                        </Col>


                                    </Row>
                                    <Row>

                                        <Col md={6} sm={6} lg={6} >
                                            <Label className='primary-text'>Contact</Label>

                                            <Input className='input' type='text' name='contact' defaultValue={member.contact} onChange={(e) => onChangeValues(e)} />



                                        </Col>
                                        <Col md={6} sm={6} lg={6} >
                                            <Label className='primary-text'>Status</Label>
                                            <Input className='input' type='text' name='status' placeholder={member.status === 1 ? "Active" : "InActive"} disabled={true} />



                                        </Col>
                                    </Row>

                                    <Row className='mt-3'>
                                        <div className="button-row m-0" style={{ paddingLeft: "" }}>
                                            <Button className=" full-width-button btn-primary" onClick={save} >Save</Button>

                                        </div>
                                    </Row>


                                </div>
                            </Col>
                        </Row>}

                        {
                            route === 4 &&
                           <UpdatePassword />
                        }



                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
