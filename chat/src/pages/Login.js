import React, { Fragment, useState } from 'react';
import { EyeOff, Eye } from 'react-feather';
import logo from "../assets/img/logo.png"
import { Button, Row, Col } from 'reactstrap';
import { authenticate } from '../helpers/request';
import useLocalStorage from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


export default function Login() {

    const { useState } = React;
    const [user, setUser] = useLocalStorage('user', {login : false});
    const userrr = useSelector(state => state.auth.user);

    console.log("userrr ",userrr);
    let navigate = useNavigate();
    var to = "/"

    const [inputs, setinputs] = useState({
        email: "",
        password: ""
    });

    const dispatch =  useDispatch();

    const [warnemail, setwarnemail] = useState(false);
    const [warnpass, setwarnpass] = useState(false);
    const [danger, setdanger] = useState(true);

    const [eye, seteye] = useState(true);
    const [pass, setpass] = useState("password");


    const inputEvent = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name == "email") {
            if (value.length > 0) {
                setdanger(true);
            }
        }
        setinputs((lastValue) => {
            return {
                ...lastValue,
                [name]: value
            }
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setwarnemail(false);
        setwarnpass(false);
        if (inputs.email.length < 1) {
            setdanger(false);
        }
        if (inputs.email == "") {
            setwarnemail(true);
        }
        else if (inputs.password == "") {
            setwarnpass(true);
        }
        else {
            console.log('inputs are', inputs);

            let response = await authenticate({data :inputs, dispatch});
            setUser(response.data);
            if (response.status) {
                console.log('inside');
                navigate(to)
            }
            console.log('response==', response);


            // alert("Logged in Successfully");
        }
    };

    const Eye = () => {
        if (pass == "password") {
            setpass("text");
            seteye(false);
        } else {
            setpass("password");
            seteye(true);
        }
    };

    return (
        <>
            <div className="containerImg">
                <div className="card">
                    <div className="form">
                        <div className="left-side">
                            <img src="https://imgur.com/XaTWxJX.jpg" />
                        </div>

                        <div className="right-side">
                            <div className="register">
                                <p>Not a member? <a href="#">Register Now</a></p>
                            </div>

                            <div className="hello">
                                <h2>Hello Again!</h2>
                                <h4>Welcome back you have been missed! </h4>
                            </div>

                            <form onSubmit={submitForm}>

                                <div className="input_text">
                                    <input className={` ${warnemail ? "warning" : ""}`} type="text" placeholder="Enter Email" name="email" value={inputs.email} onChange={inputEvent} />
                                    <p className={` ${danger ? "danger" : ""}`}><i className="fa fa-warning"></i>Please enter a valid email address.</p>
                                </div>
                                <div className="input_text">
                                    <input className={` ${warnpass ? "warning" : ""}`} type={pass} placeholder="Enter Password" name="password" value={inputs.password} onChange={inputEvent} />
                                    <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </div>
                                <div className="recovery">
                                    <p>Recovery Password</p>
                                </div>
                                <Row>
                                    <Col md={12} className='d-flex align-items-center justify-content-center'>
                                        <Button className='w-100' type='submit'>
                                            Sign In
                                        </Button>
                                    </Col>
                                </Row>


                            </form>

                            <hr />
                            <div className="or">
                                <p>or signin with</p>
                            </div>
                            <div className="boxes">
                                <span><img src="https://imgur.com/XnY9cKl.png" /></span>
                                <span><img src="https://imgur.com/ODlSChL.png" /></span>
                                <span><img src="https://imgur.com/mPBRdQt.png" /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    );
}