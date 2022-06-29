import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Search from './Search'
import { useFirebaseApp } from 'reactfire';
import { getAuth, signOut } from 'firebase/auth';
import { FaSignOutAlt } from 'react-icons/fa'

const NavBar = () => {

    const app = useFirebaseApp();
    const auth = getAuth(app);

    const navigate = useNavigate();

    return (
        <Row className='topMenu'>
            <Col sm={4}>
                <Link to={'/'}>
                    <div className='appTitle'>Les Jeux Vidéo</div>
                </Link>
            </Col>
            <Col sm={8}>
                <nav>
                    <ul className='navbar'>
                        <Link className='navItem' to={'/'}>
                            <li><strong>HOME</strong></li>
                        </Link>
                        <Link className='navItem' to={'/stats'}>
                            <li><strong>STATS</strong></li>
                        </Link>
                        <Search />
                        <button className ='searchBarButton' onClick={async () => {
                            await signOut(auth);
                            navigate('/login', {replace: true});
                        }}> 
                            <FaSignOutAlt/> 
                        </button>
                    </ul>
                </nav>
            </Col>
        </Row>
    )
}

export default NavBar