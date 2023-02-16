import React from 'react'
import { Row, Col, Offcanvas, Dropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Search from './Search'
import { useFirebaseApp} from 'reactfire';
import { getAuth, signOut } from 'firebase/auth';
import { FaHome } from 'react-icons/fa'
import { BiLogOut, BiEdit, BiShareAlt } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { IoIosStats } from 'react-icons/io'
import { GoThreeBars } from 'react-icons/go'
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';

const { version } = require('../../package.json');

const NavBar = () => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    const app = useFirebaseApp();
    const auth = getAuth(app);
    const navigate = useNavigate();
    const user = auth.currentUser;

    const [showSidebar, setShowSidebar] = useState(false);

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);
    
    return (
        !isTabletOrMobile 
        ? <Row className='topMenu'>
            <Col>
                <Link to={'/'}>
                    <h2 className='appTitle'>
                        VGTracker
                    </h2>
                </Link>
                <h5 className='appTitleSubheader'>
                    v{version} Powered by <a href='https://rawg.io/'>RAWG.io</a>
                </h5> 
            </Col>
            <Col sm={8}>
                <nav>
                    <ul className='navbar'>
                        <li>
                            <Link className='navItem' to={'/'}>
                                <strong>HOME</strong>
                            </Link>
                        </li>
                        <li>
                            <Link className='navItem' to={'/stats'}>
                                <strong>STATS</strong>
                            </Link>
                        </li>
                        <li> 
                            <Dropdown>
                                <Dropdown.Toggle className='profileDropdownButton navItem' variant='dark'>
                                    <img src={user.photoURL ? user.photoURL : window.location.origin +'/img/profile.svg.png'} referrerPolicy="no-referrer"  alt='Profile Pic'/>
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
                                        <button className ='profileDropdownLink' style={{ borderBottom: '2px solid var(--darkBgAccent)'}}>
                                            <BiEdit/> <span>Edit Profile</span>
                                        </button>    
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <button className ='profileDropdownLink' style={{ borderBottom: '2px solid var(--darkBgAccent)'}} onClick={() => {navigator.clipboard.writeText(window.location.protocol + '//' + window.location.host + '/user/' + auth.currentUser.uid)}}>
                                            <BiShareAlt/> <span>Share Your Tracker</span>
                                        </button>    
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <button className ='profileDropdownLink' onClick={async () => {
                                            signOut(auth).then(() => {
                                                navigate('/', {replace: true});
                                            });
                                        }}>
                                            <BiLogOut/> <span>Logout</span>
                                        </button>    
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            
                            
                        </li>
                        
                    </ul>
                </nav>
            </Col>
        </Row>
        :<>
            <Col className='topMenuMobile'>
                <button className="buttonEdit" onClick={handleShowSidebar} title="Show sidebar"><GoThreeBars/></button>
                <Link to={'/'}>
                    <img className = 'appLogo' src={window.location.origin +'/img/logo_cutre.png'} alt="logo"></img>
                </Link>
                <Search/>
                <Offcanvas show={showSidebar} onHide={handleCloseSidebar} className='sidebar'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <Link to={'/'}>
                            <h1 className='appTitle'>
                                VGTracker
                            </h1>
                        </Link>
                        <h5 className='appTitleSubheader'>
                            v{version} Powered by <a href='https://rawg.io/'>RAWG.io</a>
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
            </Col>
        </>
    )
}

export default NavBar