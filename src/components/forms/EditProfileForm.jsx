import React, { useState } from 'react'
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const EditProfileForm = (props) => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})
    const shouldShow = props.show;

    const [show, setShow] = useState(false);

    useEffect (() => {
        if(shouldShow === true) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [shouldShow]);

    function handleClose() {
        props.handleCloseModal();   
    }

    function handleShow() {
        //data load handler
    }

    function handleFormSubmit() {
        //data storage handler
    }

    return (
        <Modal show={show} onHide={handleClose} onShow={handleShow} size="lg" fullscreen={isTabletOrMobile} className="modalForm">
            <Modal.Header closeButton>
                <Modal.Title>Profile Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <Form>
                    <Row className='formGroupBordered'>
                    <Form.Label className='formHeader'> Game Details </Form.Label>
                    <Form.Group className='mb-3'>
                        <FloatingLabel
                        controlId='gameTitleLabel'
                        label='Game Title'
                        className='formLabel'
                        >   
                            <Form.Control type='text' className="inputText" placeholder='Title' value={game.title} readOnly/>
                        </FloatingLabel>
                    </Form.Group>
                    </Row>
                </Form> */}
            </Modal.Body>
            <Modal.Footer>
                <button className="buttonAdd" onClick={handleFormSubmit}>
                    Save Changes
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditProfileForm