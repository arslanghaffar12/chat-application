import React, { useState } from 'react'
import { Label, Row, Col, Input, Button } from 'reactstrap'
import ImageUploader from '../../components/ImgaeUploader'
import Select from 'react-select'
import "../../css/addUser.css"
import { useDispatch } from 'react-redux'
import { addUserRequest } from '../../helpers/request'
export default function AddUser() {


    const dispatch = useDispatch();

    const [member, setMember] = useState()
    const [imageData, setImageData] = useState([0]);
    console.log('imageData is===', imageData);

    const onChangeValues = (e) => {
        let _member = { ...member, [e.target.name]: e.target.value }

        setMember(_member)

    }

    const colors = {
        primaryDark: "#504190",
        primary: "#6f5cc4",
        primaryText: "#969fb0",
        primaryTextDark: "#334666",


    }


    const colourStyles = {
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isSelected ? colors.primaryDark : 'white',


            };
        },

    }

    const save = () => {
        console.log('member====', member);
        let payload = {
            data: {...member, image : imageData[0].thumbUrl},
            dispatch
        }
        let response = addUserRequest(payload);
        console.log('response of creating user', response);
    }
    return (
        <div className='p-3'>
            <h4>Add New Member</h4>
            <Row>
                <Col md={6} sm={6} lg={6}>
                    <Row>

                        <Col md={6} sm={6} lg={6} >
                            <Label className='primary-text'>Image</Label>
                            <ImageUploader
                             setImageData={(e) => setImageData(e)}
                             imageData={imageData}
                            listType={"picture-card"}


                              />
                        </Col>



                        <Col md={6} sm={6} lg={6}>
                            <Label className='primary-text' >Name</Label>
                            <Input className='input' type='text' name='name' onChange={(e) => onChangeValues(e)} />

                            <Label className='primary-text'>Role</Label>
                            <Select
                                className='main_select'
                                options={[
                                    { label: 'Member', value: 0 },
                                    { label: 'Admin', value: 1 },
                                ]}
                                styles={colourStyles}
                                onChange={(e) => onChangeValues({ target: { name: 'role', value: e.value } })}
                            />

                        </Col>


                    </Row>
                    <Row>

                        <Col md={6} sm={6} lg={6} >
                            <Label className='primary-text'>Email</Label>
                            <Input className='input' type='text' name='email' onChange={(e) => onChangeValues(e)} />

                        </Col>
                        <Col md={6} sm={6} lg={6} >
                            <Label className='primary-text'>Password</Label>
                            <Input className='input' type='password' name='password' onChange={(e) => onChangeValues(e)} />

                        </Col>

                    </Row>
                    <Row>

                        <Col md={6} sm={6} lg={6} >
                            <Label className='primary-text'>Contact</Label>

                            <Input className='input' type='text' name='contact' onChange={(e) => onChangeValues(e)} />



                        </Col>
                        <Col md={6} sm={6} lg={6} >
                            <Label className='primary-text'>Status</Label>
                            <Select
                                options={[
                                    { label: 'Active', value: 1 },
                                    { label: 'InActive', value: 0 },

                                ]}
                                styles={colourStyles}
                                onChange={(e) => onChangeValues({ target: { name: 'status', value: e.value } })}
                            />

                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        <div className="button-row m-0" style={{ paddingLeft: "0.2rem" }}>
                            <Button className=" full-width-button btn-primary" onClick={save} >Save</Button>
                            <Button className="full-width-button btn-primary-dark">Save & Add Another</Button>
                            <Button className="full-width-button cancel">Cancel</Button>
                        </div>
                    </Row>
                </Col>
            </Row>


        </div>
    )
}
