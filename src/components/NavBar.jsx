import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Search from './Search'

const NavBar = () => {
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
                </ul>
            </nav>
        </Col>
    </Row>
  )
}

export default NavBar