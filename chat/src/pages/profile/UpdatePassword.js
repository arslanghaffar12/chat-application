import React, { useState } from 'react'
import { Button, Card, Col, Input, Label, ListGroup, ListGroupItem, Row } from 'reactstrap'
import { useSelector } from 'react-redux';
import { updatePassword } from '../../helpers/request';

export default function UpdatePassword(props) {

    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [checkPassword, setCheckPassword] = useState();
    const [error, setError] = useState('not error');


    const user = useSelector(state => state.auth.user);



    const handlePassword = () => {
        if (newPassword !== checkPassword) {
            setError("password is not match")
            console.log("password is not match");
        }
        else if (!oldPassword) {
            console.log('old password is null');
            setError("old password is null")

        }
        else {
            let obj = {
                _id: user._id,
                oldPassword: oldPassword,
                newPassword: newPassword
            }

            console.log('obj is ',obj);

            const response = updatePassword({ data: obj })
        }
    }

    return (
        <Row>
            <Col md={12} lg={12} sm={12}>

                <div className='p-3 px-4 '>
                    <h4>Password Change</h4>
                    <div className='verticle-center mt-5'>

                        <div className='form-group'>
                            <Label className='primary-text'>Old Password</Label>
                            <Input className='input' type='text' name='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <Label className='primary-text'>New Password</Label>
                            <Input className='input' type='text' name='old-password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <Label className='primary-text'>New Password Again</Label>
                            <Input className='input' type='text' name='old-password' value={checkPassword} onChange={(e) => setCheckPassword(e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <Button className='btn-primary input' onClick={() => handlePassword()}>Update</Button>
                        </div>



                        {error}



                    </div>

                </div>

            </Col>
        </Row>
    )
}
