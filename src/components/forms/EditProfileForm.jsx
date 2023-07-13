import { getAuth, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useFirebaseApp, useFirestore, useFirestoreDocDataOnce, useStorage } from 'reactfire';
import {AiOutlineEdit } from 'react-icons/ai'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const EditProfileForm = (props) => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})
    const shouldShow = props.show;

    const [show, setShow] = useState(false);

    const firestore = useFirestore();
    const app = useFirebaseApp();
    const storage = useStorage();
    const auth = getAuth(app);
    const user = auth.currentUser;
    const profileDataRef = doc(firestore, 'profiles', user.uid);
    const {status, data: profile} = useFirestoreDocDataOnce(profileDataRef);

    const [profileData, setProfileData] =useState({});
    const [imageCache, setImageCache] = useState(null);

    useEffect (() => {
        if(shouldShow === true) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [shouldShow]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageCache(file);
    };

    function handleChange(field, value) {
        setProfileData({...profileData, [field]: value})
    }

    function handleClose() {
        props.handleCloseModal();   
    }

    function handleFormSubmit() {
        
        if(imageCache) {
            const imageRef = ref(storage, `images/${user.uid}`);
            uploadBytes(imageRef, imageCache).then(() => {
                getDownloadURL(imageRef).then((imageURL) => {
                    handleChange('picture', imageURL);
                    updateProfile(user, {photoURL: imageURL})
                    .catch(function(error) { 
                        console.log(error) 
                    });
                })
            })
        }
        setDoc(profileDataRef, profileData);
        handleClose();
    }

    useEffect(() => {
        if(status === 'success' && Object.keys(profileData).length === 0) {
            setProfileData({username: profile.username, name: profile.name, surname: profile.surname, picture: user.photoURL})
        }
    }, [status])

    return (
        <Modal show={show} onHide={handleClose} size="lg" fullscreen={isTabletOrMobile} className="modalForm">
            <Modal.Header closeButton>
                <Modal.Title>Profile Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Form className='formGroupBordered'>
                        <Row>
                        <Col md={4}>
                            <Row className='formGroupBorderedFullHeight'>
                                <div className="containerProfilePic">
                                    <img
                                    src={imageCache ? URL.createObjectURL(imageCache) : user.photoURL ? user.photoURL : window.location.origin +'/img/profile.svg.png'} 
                                    referrerPolicy="no-referrer"
                                    alt="Profile Pic"
                                    style={{ width: '100%', minHeight: '100%' }}
                                    accept="image/*"
                                    />
                                    <div className="btnEditPicture">
                                        <div className='btnEditPictureFake'>
                                            <AiOutlineEdit/>
                                        </div>
                                        <input
                                        type='file' 
                                        title="Select a file"
                                        onChange={handleImageUpload}
                                        style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', opacity: '0', borderRadius: '50%'}}/>
                                    </div>
                                </div>
                            </Row>
                        </Col>
                        <Col md={8}>
                            <Row >
                            <Form.Label className='formHeader' style={{padding: '0 0 0.5rem 1rem'}}> My Account </Form.Label>
                            <Form.Group className='mb-3'>
                                <FloatingLabel
                                controlId='usernameLabel'
                                label='Userame'
                                className='formLabel'
                                >   
                                    <Form.Control 
                                    type='text' 
                                    className="inputText" 
                                    placeholder='Username' 
                                    value={profileData.username ? profileData.username : ''} 
                                    onChange={e => {handleChange('username', e.target.value)}} />
                                </FloatingLabel>
                            </Form.Group>
            
                            <Form.Group className='mb-3'>
                                <FloatingLabel
                                controlId='nameLabel'
                                label='Name'
                                className='formLabel'
                                >   
                                    <Form.Control 
                                    type='text' 
                                    className="inputText" 
                                    placeholder='Name' 
                                    value={profileData.name ? profileData.name : ''} 
                                    onChange={e => {handleChange('name', e.target.value)}} />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className='mb-3'>
                                <FloatingLabel
                                controlId='surnameLabel'
                                label='Surname'
                                className='formLabel'
                                >   
                                    <Form.Control 
                                    type='text' 
                                    className="inputText" 
                                    placeholder='Surname' 
                                    value={profileData.surname ? profileData.surname : ''} 
                                    onChange={e => {handleChange('surname', e.target.value)}} />
                                </FloatingLabel>
                            </Form.Group>
                            </Row>
                        </Col>
                        </Row>
                    </Form>
                
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