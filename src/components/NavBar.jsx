import React from 'react'
import { Row, Col, Offcanvas } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Search from './Search'
import { useFirebaseApp} from 'reactfire';
import { getAuth, signOut } from 'firebase/auth';
import { FaSignOutAlt, FaHome } from 'react-icons/fa'
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
                            <Search />
                        </li>
                        <li>
                            <button className ='searchBarButton' onClick={async () => {
                                signOut(auth).then(() => {
                                    navigate('/', {replace: true});
                                });
                            }}> 
                                {user.displayName} <FaSignOutAlt/> 
                            </button>
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
                                <FaSignOutAlt className='navSideButton'/>
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