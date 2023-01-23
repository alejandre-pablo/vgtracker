import React, { forwardRef } from 'react'
import { Rating } from 'react-simple-star-rating'
import { MdClose } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai'
import { Row, Col, Card } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import { RiArrowDropUpLine, RiArrowDropDownLine } from 'react-icons/ri'

const Game = forwardRef((props, ref) => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    const {game, onClickEditItem, onClickRemoveItem} = props;

    const [isCollapsed, setCollapsed] = useState(true);

    function handleAccordion() {
        isCollapsed ? setCollapsed(false) : setCollapsed(true);
    }
    return (
        isTabletOrMobile 
        ?
        <div ref={ref} className='gameMobile'>
            <Card className='gameCard'>
                <Card.Img src={game.image} alt="Game background" />
                <Card.ImgOverlay className= {isCollapsed ? 'gameCardInfoCollapsed' : 'gameCardInfo'}>
                    <Card.Title> 
                        <div>{game.title}</div> 
                        <button className='collapseInfoButton' onClick={handleAccordion}> 
                            {isCollapsed ? <RiArrowDropUpLine/> : <RiArrowDropDownLine/>}
                        </button>
                    </Card.Title>
                    <Card.Text >
                        <div> 
                            <Rating 
                                readonly={true} 
                                size={20} 
                                ratingValue={game.rating.reduce((a, b) => a + b, 0) / game.rating.length} 
                                fillColor ={(game.rating.reduce((a, b) => a + b, 0) / game.rating.length) === 100 ? '#FFBC0D' : '#fff'} 
                                emptyColor={'#000'}/>
                        </div>
                        <div> 
                            Played on {game.platform} 
                        </div>
                        <div> 
                            {game.playtime} hours 
                        </div>
                        <div>
                            <button className="textButtonMobile" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry">Edit</button>
                            <span>| </span>
                            <button className="textButtonMobile" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" >Remove</button>
                        </div>
                    </Card.Text>
                </Card.ImgOverlay>
            </Card>
        </div>
        : <div ref={ref} className="game">
            {game.playstatus !== 'plantoplay' 
                ? <Row>
                    <div className="gameImageWrapper" style={{width:'9vw'}} >
                        <img className='gameListImage' src={game.image} alt=''/>
                    </div>
                        <div className='gameInfoUncentered' style={{width:'22vw'}}> 
                            <div className='gameTitle'>{game.title}</div> 
                        </div>
                        <div className='gameInfo' style={{width:'9vw'}}> {game.platform} </div>
                        <div className='gameInfo' style={{width:'9vw'}}> {game.playtime} </div>
                        <div className='gameInfo' style={{width:'9vw'}}> {game.playdate} </div>
                        <div className='gameInfo' style={{width:'18vw'}}>
                            <span className='gameRating' >
                                <Rating 
                                    readonly={true} 
                                    size={20} 
                                    ratingValue={game.rating.reduce((a, b) => a + b, 0) / game.rating.length} 
                                    fillColor ={(game.rating.reduce((a, b) => a + b, 0) / game.rating.length) === 100 ? '#FFBC0D' : '#fff'} 
                                    emptyColor={'#2d373c'}/>
                            </span>
                        </div>
                        <div className='rightButton' style={{width:'5vw'}}>
                            <button className="buttonEdit" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry"><AiOutlineEdit /></button>
                            <button className="buttonRemove" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" ><MdClose /></button>
                        </div>
                    </Row>    
                :<Row>
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
            }
        </div>
    )
});

export default Game