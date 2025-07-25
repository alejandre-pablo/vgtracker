import React, { useEffect } from 'react'
import { Row, Col, Offcanvas, Dropdown, Toast, Navbar} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Search from './Search'
import { useFirebaseApp, useUser} from 'reactfire';
import { getAuth, signOut } from 'firebase/auth';
import { FaHome} from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { IoIosStats } from 'react-icons/io'
import { RxHamburgerMenu } from 'react-icons/rx'
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import EditProfileForm from './forms/EditProfileForm';
import useScrollVisibility from '../hooks/useScrollVisibility';

const { version } = require('../../package.json');

const NavBar = () => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})
    const visible = useScrollVisibility();

    const app = useFirebaseApp();
    const auth = getAuth(app);
    const navigate = useNavigate();
    const {data: user} = useUser();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);

    function handleEditProfile() {
        setShowModal(true);
    }
    
    return (
        !isTabletOrMobile
        ? 
        <>
        {user? <EditProfileForm show ={showModal} handleCloseModal = {handleCloseModal}/> : <></>}
        <Row className='topMenu'>
            <Col>
                <Link to={'/'}>
                    <h2 className='appTitle'>
                        VGTracker
                    </h2>
                </Link>
                <h5 className='appTitleSubheader'>
                    v{version} Powered by <a href='https://www.igdb.com/'>IGDB</a>
                </h5> 
            </Col>
            <Col sm={8}>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={1500} autohide className='toast'>
                    <Toast.Body>Link copied to clipboard!</Toast.Body>
                </Toast>
                <nav>
                    <ul className='navbar'>
                        <li>
                            {user?
                                <Link className='navItem' to={'/'}>
                                    <strong>HOME</strong>
                                </Link>
                            :<></>}
                        </li>
                        <li>
                            {user?
                                <Link className='navItem' to={'/stats'}>
                                    <strong>STATS</strong>
                                </Link>
                            :<></>}
                        </li>
                        <li style={{width: '18vw'}}>
                            {user?
                                <Search />
                            :<></>}
                        </li>
                        <li> 
                            {user? 
                                <Dropdown >
                                    <Dropdown.Toggle className='profileDropdownButton navItem' variant='dark'>
                                        <img src={user.photoURL ? user.photoURL : window.location.origin +'/img/profile.svg.png'} referrerPolicy="no-referrer"  alt='Profile Pic' style={{objectFit: 'cover'}}/>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className='profileDropdown'>
                                        <Dropdown.Item>
                                            {/* <Row>
                                                <Col md='4'>
                                                    <img 
                                                        src={user.photoURL ? user.photoURL : window.location.origin +'/img/profile.svg.png'} 
                                                        style={{width: '3.5rem', height: '3.5rem', marginRight: '0.5rem'}} 
                                                        referrerPolicy="no-referrer" 
                                                        alt='Profile Pic'
                                                    />
                                                </Col>
                                                <Col md='8'>
                                                    <Row>
                                                        <div style={{fontSize: '1.4rem'}}>
                                                            {user.displayName}
                                                        </div>
                                                        
                                                    </Row>
                                                    <Row>
                                                        {user.email}
                                                    </Row>
                                                </Col>
                                            </Row> */}
                                            <button className ='profileDropdownLink' >
                                                <span onClick={handleEditProfile}>Edit Profile</span>
                                            </button>    
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <button 
                                                className ='profileDropdownLink' 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.protocol + '//' + window.location.host + '/user/' + auth.currentUser.uid);
                                                    setShowToast(true)
                                                }}>
                                                <span>Share Your Tracker</span>
                                            </button>    
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <button className ='profileDropdownLink' onClick={async () => {
                                                signOut(auth).then(() => {
                                                    navigate('/', {replace: true});
                                                });
                                            }}>
                                                <span>Logout</span>
                                            </button>    
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            : <div style={{marginTop: '0.3rem', marginRight: '2rem'}}>
                                <Link  to={'/login'} className='authLink'>
                                    <strong>Log In</strong>
                                </Link>
                                <span> / </span>
                                <Link to={'/signup'} className='authLink'>
                                    <strong>Sign Up</strong>
                                </Link>
                            </div>}    
                        </li>   
                    </ul>
                </nav>
            </Col>
        </Row>
        </>
        :<>
            {user? <EditProfileForm show ={showModal} handleCloseModal = {handleCloseModal}/> : <></>}
            <Navbar className={`topMenuMobile ${visible ? "visible" : "hidden"}`}>
                <Col md='3' style={{position: 'relative'}}>
                    <button className="buttonHamburguerMobile" onClick={handleShowSidebar} title="Show sidebar"><RxHamburgerMenu/></button>
                </Col>
                <Col md='3'>
                    <Navbar.Brand href="/" style={{height:'100%', padding:'0' }}>
                        <img className = 'appLogo' src={window.location.origin +'/img/logo_cutre.png'} alt="logo"></img>
                    </Navbar.Brand>
                </Col>
                <Col md='6'  style={{ display: 'flex', height: '65%'}}>
                        <Search/>
                </Col>
            </Navbar>   
            <Offcanvas show={showSidebar} onHide={handleCloseSidebar} className='sidebar'>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            <Link to={'/'}>
                                <h1 className='appTitle'>
                                    VGTracker
                                </h1>
                            </Link>
                            <h5 className='appTitleSubheader'>
                                v{version} Powered by <a href='https://www.igdb.com/'>IGDB</a>
                            </h5> 
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <nav>
                            <ul className='navbarMobile'>
                                <li>
                                    <Link className='navItem' to={'/'} onClick={handleCloseSidebar}>
                                        <FaHome className='navSideButton'/>
                                        <span>HOME</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className='navItem' to={'/stats'} onClick={handleCloseSidebar}>
                                        <IoIosStats className='navSideButton'/>   
                                        <span>STATS</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className='navItem' to={'/'} onClick={handleCloseSidebar}>
                                        <CgProfile className='navSideButton'/>
                                        <span>PROFILE</span>
                                    </Link>
                                </li>
                                <li>
                                    <button className='navItem navLogOutButton' onClick={async () => {
                                            signOut(auth).then(() => {
                                                sessionStorage.setItem('games', []);
                                                navigate('/', {replace: true});
                                            });
                                        }}>
                                        <BiLogOut className='navSideButton'/>
                                        <span>LOG OUT</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </Offcanvas.Body>
                </Offcanvas>
        </>
    )
}

export default NavBar