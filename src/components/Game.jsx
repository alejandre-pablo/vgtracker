import React, { forwardRef } from 'react'
import { Rating } from 'react-simple-star-rating'
import { MdClose, MdDateRange } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai'
import { BiTime } from 'react-icons/bi'
import { Row, Col, Card } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const Game = forwardRef((props, ref) => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    const {game, onClickEditItem, onClickRemoveItem} = props;
    return (
        isTabletOrMobile 
        ?
        <div ref={ref} className='gameMobile'>
            <Card className='gameCard'>
                <Card.Img src={game.image} alt="Game background" />
                <Card.ImgOverlay className='gameCardRating'>
                    <Card.Text> 
                        <Rating 
                            readonly={true} 
                            size={20} 
                            ratingValue={game.rating.reduce((a, b) => a + b, 0) / game.rating.length} 
                            fillColor ={(game.rating.reduce((a, b) => a + b, 0) / game.rating.length) === 100 ? '#FFBC0D' : '#fff'} 
                            emptyColor={'#000'}/>
                    </Card.Text>
                </Card.ImgOverlay>
                <Card.ImgOverlay className='gameCardInfo'>
                    <Card.Title> {game.title} </Card.Title>
                    <Row xs={2}>
                        
                        <Card.Text> 
                            {game.platform} 
                        </Card.Text>
                        <Card.Text> 
                            <BiTime/> {game.playtime} hours | <MdDateRange/> {game.playdate} 
                        </Card.Text>
                    </Row>
                </Card.ImgOverlay>
            </Card>
        </div>
        : <div ref={ref} className="game">
            {game.playstatus !== 'plantoplay' 
                ? <Row>
                    <Col md={1}>
                        <img className='gameListImage' src={game.image} alt=''/>
                    </Col>
                    <Col md={11}>
                        <Row /* className='mainGameInfo' */>
                            <Col md={3}>
                                <span className='gameTitle'>{game.title}</span>
                            </Col>
                            <Col md={1}>
                            <span className='gamePlatform'> {game.platform}</span> 
                            </Col>
                            <Col md={3}>
                                <span className='gamePlaytime'>{game.playtime}</span>
                            </Col>
                            <Col md={3}>
                                <span className='gameRating'>
                                    <Rating 
                                        readonly={true} 
                                        size={20} 
                                        ratingValue={game.rating.reduce((a, b) => a + b, 0) / game.rating.length} 
                                        fillColor ={(game.rating.reduce((a, b) => a + b, 0) / game.rating.length) === 100 ? '#FFBC0D' : '#fff'} 
                                        emptyColor={'#2d373c'}/>
                                </span>
                            </Col>
                            <Col md={2} className='rightButton'>
                                <button className="buttonEdit" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry"><AiOutlineEdit /></button>
                                <button className="buttonRemove" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" ><MdClose /></button>
                            </Col>
                        </Row>
                    </Col>    
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