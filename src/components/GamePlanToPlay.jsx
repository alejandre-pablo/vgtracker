import React from 'react'
import { MdClose } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai'
import { Row, Col } from 'react-bootstrap';

const GamePlanToPlay = (props) => {
    const { onClickRemoveItem, onClickEditItem, game} = props;

    return (
        <li className="game">
            <Row>
                <Col md={1}>
                    <img className='gameListImage' src={game.image} alt=''/>
                </Col>
                <Col md ={4}>
                    <span className='gameTitle'>{game.title}</span>
                </Col>
                <Col md ={5}>
                <span className='gamePlatform'> {game.detail} </span> 
                </Col>
                <Col className='rightButton'>
                    <button className="buttonEdit" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry"><AiOutlineEdit /></button>
                    <button className="buttonRemove" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" ><MdClose /></button>
                </Col>
            </Row>
        </li>
    )
}

export default GamePlanToPlay