import React from 'react'
import { Rating } from 'react-simple-star-rating'
import { MdClose } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai'
import { Row, Col } from 'react-bootstrap';

const Game = (props) => {
    const { onClickRemoveItem, onClickEditItem, game} = props;

    return (
        <li className="game">
            <Row>
                <Col md={1}>
                    <img className='gameListImage' src={game.image} alt=''/>
                </Col>
                <Col md={11}>
                    <Row /* className='mainGameInfo' */>
                        <Col md={3}>
                            <span className='gameTitle'>{game.title}</span>
                        </Col>
                        <Col md={1}>
                        <span className='gamePlatform'> {game.platform} </span> 
                        </Col>
                        <Col md={3}>
                            <span className='gamePlaytime'>{game.playtime}</span>
                        </Col>
                        <Col md={3}>
                            <span className='gameRating'>
                                <Rating readonly={true} size={20} ratingValue={game.rating.reduce((a, b) => a + b, 0) / game.rating.length} fillColor ={"#fff"} emptyColor={'#2d373c'}/>
                            </span>
                        </Col>
                        <Col md={2} className='rightButton'>
                            <button className="buttonEdit" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry"><AiOutlineEdit /></button>
                            <button className="buttonRemove" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" ><MdClose /></button>
                        </Col>
                    </Row>
                    {/* <Row className='focusedGameInfo'>
                        <Col md={3}>
                            <span className='gameTitle'>{game.title}</span>
                        </Col>
                        <Col md={1}>
                        <span className='gamePlatform'> {game.platform} </span> 
                        </Col>
                        <Col md={3}>
                            <span className='gamePlaytime'>{game.playtime}</span>
                        </Col>
                        <Col md={3}>
                            <span className='gameRating'>
                                <Rating readonly={true} size={20} ratingValue={game.rating.reduce((a, b) => a + b, 0) / game.rating.length} fillColor ={"#fff"} emptyColor={'#2d373c'}/>
                            </span>
                        </Col>
                        <Col md={2} className='rightButton'>
                            <button className="buttonEdit" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry"><AiOutlineEdit /></button>
                            <button className="buttonRemove" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" ><MdClose /></button>
                        </Col>
                    </Row> */}
                </Col>    
            </Row>
        </li>
    )
}

export default Game