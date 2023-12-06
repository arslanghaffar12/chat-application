import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Col, Container, Row, Table } from 'reactstrap';
import "../css/users.css"
import brand from "../assets/img/brand.jpg"
import { Delete, Edit, Filter } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserRequest, usersRequest } from '../helpers/request';
import { Link } from 'react-router-dom';
import DeleteModal from '../modal/DeleteModal';

export default function Users() {


    const users = useSelector(state => state.users.users);
    const [usersToShow, setUsersToShow] = useState([]);
    const [modal, setModal] = useState(false);
    const [currentUser, setCurrentUser] = useState()


    const colors = {
        primaryDark: "#504190",
        primary: "#6f5cc4",
        primaryText: "#969fb0",
        primaryTextDark: "#334666",


    }

    const [currentView, setCurrentView] = useState('member')

    const tabStyle = (type, selected) => {
        return {
            fontSize: "14px",
            fontWeight: "600",
            border: "0px",
            fontFamily: "sans-serif",
            color: selected === type ? colors.primaryTextDark : colors.primaryText,
            background: "white",
            padding: "15px 25px 8px 25px",
            borderBottom:
                selected === type
                    ? "3px solid " + colors.primaryDark
                    : "3px solid transparent",
            outline: "none",
        };
    };



    const dispatch = useDispatch()

    const fetchUsers = async () => {
        await usersRequest({ dispatch })

    }


    const deleteUser = async (id) => {

        const response = await deleteUserRequest({ _id: id });
        console.log('response of Delete', response);
        if (response.status) {
            fetchUsers()
        }

    }


    useEffect(() => {
        if (users) {
            let currentToShow = currentView === 'member' ? 0 : 1
            let _usersToShow = users.filter((item) => { return item.role === currentToShow });
            setUsersToShow(_usersToShow)
        }

    }, [users, currentView])


    useEffect(() => {
        fetchUsers()

    }, [])

    return (
        <div className='m-1'>

            <Row>
                <Col md={2}>

                    <ButtonGroup size="sm" style={{ borderRadius: "0px" }}>

                        <Button style={tabStyle('member', currentView)}
                            onClick={() => setCurrentView('member')}
                        >Members</Button>
                        <Button style={tabStyle('admin', currentView)}
                            onClick={() => setCurrentView('admin')}

                        >Admins</Button>
                    </ButtonGroup>

                </Col>
                <Col md={7}>
                </Col>
                <Col md={3} className='totalStatus'>
                    <span>Total {currentView} : {usersToShow.length}</span>
                    <span>Total member : 2000</span>

                </Col>
            </Row>


            {/* <h4 className="heading">Members</h4> */}


            <Row className='my-4' style={{ backgroundColor: "" }}>
                <Col md={2}>
                    <Link to={'/add-member'}><Button className='btn-primary'>  {`Add new ${currentView}`}</Button></Link>
                </Col>

                <Col md={8}>
                    {/* <Button>Import Members</Button> */}
                </Col>
                <Col md={2} className="text-right">
                    <Button className='btn-primary'>

                        <Filter size={14} color='#fff' className='mx-1' />  Filter
                    </Button>
                </Col>
            </Row>

            <Card className='p-3 my-2' style={{ borderColor: "white" }}>
                <Table className="table-borderless p-3">
                    <thead>
                        <tr>
                            <th className="">Photo</th>
                            <th className="">Member Name</th>
                            <th className="">Mobile</th>
                            <th className="">Email</th>
                            <th className="">Status</th>
                            <th className="text-center">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersToShow?.map((data) => (
                            <tr key={data.id} className="bg-white">
                                <td className=""><img src={data.image} alt={data.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} /></td>
                                <td className="">{data.name}</td>
                                <td className="">{data.contact}</td>
                                <td className="">{data.email}</td>
                                <td className="">{data.status == 1 ? 'Active' : 'InActive'}</td>
                                <td className="text-center">

                                    <Delete size={14} color='#504190' className='cursor-pointer' onClick={() => { setCurrentUser(data); setModal(true) }} />
                                    <Edit className='mx-2 cursor-pointer' size={14}  color='#504190' />



                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </Card>

            {(currentUser !== undefined && modal) && <DeleteModal modal={modal} setModal={(output) => setModal(output)} delete={() => deleteUser(currentUser._id)} />}



        </div>
    )
}
