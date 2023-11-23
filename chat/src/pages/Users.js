import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Col, Container, Row, Table } from 'reactstrap';
import "../css/users.css"
import brand from "../assets/img/brand.jpg"
import { Filter } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { usersRequest } from '../helpers/request';

export default function Users() {


    const users = useSelector(state => state.users.users);


    const colors = {
        primaryDark: "#504190",
        primary: "#6f5cc4",
        primaryText : "#969fb0",
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

    const Data = [
        { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
        { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
        { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },
    
        { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
        { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
        { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },
        
        { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
        { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
        { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },
        
        { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
        { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
        { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },
        
        { id: 1, photo: brand, memberName: 'John Doe', mobile: '123-456-7890', email: 'johndoe@email.com', status: 'Active', operation: 'Edit' },
        { id: 2, photo: brand, memberName: 'Jane Smith', mobile: '987-654-3210', email: 'janesmith@email.com', status: 'Inactive', operation: 'Delete' },
        { id: 3, photo: brand, memberName: 'Peter Jones', mobile: '555-123-4567', email: 'peterjones@email.com', status: 'Pending', operation: 'View' },
    ]

    const dispatch = useDispatch()

    const fetchUsers = async () => {
        await usersRequest({dispatch})

    }


    useEffect(  () => {
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
                    <span>Total member : 2000</span>
                    <span>Total member : 2000</span>

                </Col>
            </Row>


            {/* <h4 className="heading">Members</h4> */}


            <Row className='my-4' style={{ backgroundColor: "" }}>
                <Col md={2}>
                    <Button className='btn-primary'>  {`Add new ${currentView}`}</Button>
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
                        {users?.map((data) => (
                            <tr key={data.id} className="bg-white">
                                <td className=""><img src={data.photo} alt={data.name} style={{ width: '50px', height: '50px' }} /></td>
                                <td className="">{data.name}</td>
                                <td className="">{data.mobile}</td>
                                <td className="">{data.email}</td>
                                <td className="">{data.status}</td>
                                <td className="text-center">{data.operation}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </Card>


        </div>
    )
}
