import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Search from './Search'
import { useFirebaseApp} from 'reactfire';
import { getAuth, signOut } from 'firebase/auth';
import { FaSignOutAlt } from 'react-icons/fa'

const NavBar = () => {

    const app = useFirebaseApp();
    const auth = getAuth(app);

    const navigate = useNavigate();

    const user = auth.currentUser;

    return (
        <Row className='topMenu'>
            <Col sm={4}>
                <Link to={'/'}>
                    <h1 className='appTitle'>
                        VGTracker 
                    </h1>
                </Link>
                <h5 className='appTitleSubheader'>
                    Powered by <a href='https://rawg.io/'>RAWG.io</a>
                </h5> 
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
                            navigate('/', {replace: true});
                        }}> 
                            {user.displayName} <FaSignOutAlt/> 
                        </button>
                    </ul>
                </nav>
            </Col>
        </Row>
    )
}

export default NavBar