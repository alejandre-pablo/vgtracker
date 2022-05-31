import React from 'react'
import { Rating } from 'react-simple-star-rating'
import { MdClose } from 'react-icons/md';
import { Row, Col } from 'react-bootstrap';

const Game = (props) => {
    const { onClickRemoveItem, game } = props;
    return (
        <li className="game">
            <Row>
                <Col md ={4}>
                    <span className='gameTitle'>{game.title}</span>
                </Col>
                <Col>
                <span className='gamePlatform'> {game.platform} </span> 
                </Col>
                <Col>
                    <span className='gamePlaytime'>{game.playtime}</span>
                </Col>
                <Col>
                    <span className='gameRating'>
                        <Rating readonly={true} size={20} ratingValue={game.rating.reduce((a, b) => a + b, 0) / game.rating.length} fillColor ={"#fff"} emptyColor={'#2d373c'}/>
                    </span>
                </Col>
                <Col className='rightButton'>
                    <button className="buttonRemove" onClick={(e) => { onClickRemoveItem(game.title) }} ><MdClose /></button>
                </Col>
            </Row>
        </li>
    )
}

export default Game