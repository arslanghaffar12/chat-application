import { Row, Col, Card, CardBody, ButtonGroup, Button, Progress, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { CustomInput, Form, FormGroup, Input, Label, } from 'reactstrap';
import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Toast, ToastBody, ToastHeader } from 'reactstrap';
import { Trash2 } from 'react-feather';




export default function DeleteModal(props) {

    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal)
        props.setModal(!modal)
    }

    const deleteItem = () => {
        props.setModal(false)
        setModal(false)
        props.delete();

    }

    useEffect(() => {
        setModal(props.modal);
    }, [props])

    return <div>
        <Modal isOpen={modal} toggle={toggle} centered >
            <ModalBody className='text-center'>
                <Trash2 size='70' color='#fd7e14'/>
                <h4>Are you sure?</h4>
                <span className="d-block small opacity-50 my-3">Do you really want to delete this record? This process cannot be undone </span>
                <Button color='#c1c1c1' className='btn btn-secondary  m-2 mt-4' onClick={toggle}>Cancel</Button>
                <Button color="" className='deleteButton m-2 mt-4' onClick={deleteItem}>Delete</Button>

            </ModalBody>
        </Modal>
    </div>;
}
