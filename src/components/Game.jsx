import React, { forwardRef } from 'react'
import { Rating } from 'react-simple-star-rating'
import { MdClose } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai'
import { Row, Card } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import { RiArrowDropUpLine, RiArrowDropDownLine } from 'react-icons/ri'
import { IMAGES_SERVER_URL } from '../constants/urls';
import { platformNameMap } from '../constants/platforms';


const Game = forwardRef((props, ref) => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    const {game, onClickEditItem, onClickRemoveItem} = props;

    const [isCollapsed, setCollapsed] = useState(true);

    function getCleanPlatformName(name) {
        return platformNameMap[name] || name;
    }

    function handleAccordion() {
        isCollapsed ? setCollapsed(false) : setCollapsed(true);
    }
    return (
        isTabletOrMobile 
        ?
        <div ref={ref} className='gameMobile'>
            <Card className='gameCard'>
                <Card.Img src={IMAGES_SERVER_URL.T_720P + game.imageId + '.jpg'} alt="Game background" />
                <Card.ImgOverlay className= {isCollapsed ? 'gameCardInfoCollapsed' : 'gameCardInfo'}>
                    <Card.Title> 
                        <div>{game.title}</div> 
                        <button className='collapseInfoButton' onClick={handleAccordion}> 
                            {isCollapsed ? <RiArrowDropUpLine/> : <RiArrowDropDownLine/>}
                        </button>
                    </Card.Title>
                    <Card.Body >
                        <div> 
                            <Rating 
                                readonly={true} 
                                size={20} 
                                allowFraction
                                initialValue={game.rating.reduce((a, b) => a + b, 0) / game.rating.length} 
                                fillColor ={(game.rating.reduce((a, b) => a + b, 0) / game.rating.length) === 5 ? '#FFBC0D' : '#fff'} 
                                emptyColor={'#121318'}/>
                        </div>
                        <div> 
                            Played on {getCleanPlatformName(game.platform.name)} 
                        </div>
                        <div> 
                            {game.playtime} hours 
                        </div>
                        <div>
                            <button className="textButtonMobile" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry">Edit</button>
                            <span>| </span>
                            <button className="textButtonMobile" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" >Remove</button>
                        </div>
                    </Card.Body>
                </Card.ImgOverlay>
            </Card>
        </div>
        : <div ref={ref} className="game">
            {game.playstatus !== 'plantoplay' 
                ? <Row>
                    <div className="gameImageWrapper" style={{width:'9vw'}} >
                        <img className='gameListImage' src={IMAGES_SERVER_URL.T_THUMB + game.imageId + '.jpg'} alt=''/>
                    </div>
                    <div className='gameInfoUncentered' style={{width:'22vw'}}> 
                        <div className='gameTitle'>{game.title}</div> 
                    </div>
                    <div className='gameInfo' style={{width:'10vw'}}> {getCleanPlatformName(game.platform.name)} </div>
                    <div className='gameInfo' style={{width:'10vw'}}> {game.playtime} h </div>
                    <div className='gameInfo' style={{width:'10vw'}}> {game.playdate} </div>
                    <div className='gameInfo' style={{width:'15vw'}}>
                        <span className='gameRating' >
                            <Rating 
                                readonly={true} 
                                size={20} 
                                allowFraction
                                initialValue={game.rating.reduce((a, b) => a + b, 0) / game.rating.length} 
                                fillColor ={(game.rating.reduce((a, b) => a + b, 0) / game.rating.length) === 5 ? '#FFBC0D' : '#fff'} 
                                emptyColor={'#121318'}/>
                        </span>
                    </div>
                    <div className='rightButton hoverShown'>
                        <button className="buttonEdit" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry"><AiOutlineEdit /></button>
                        <button className="buttonRemove" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" ><MdClose /></button>
                    </div>
                </Row>    
                :<Row>
                    <div className="gameImageWrapper" style={{width:'9vw'}} >
                        <img className='gameListImage' src={IMAGES_SERVER_URL.T_THUMB + game.imageId + '.jpg'} alt=''/>
                    </div>
                    <div className='gameInfoUncentered' style={{width:'30vw'}}> 
                        <div className='gameTitle'>{game.title}</div> 
                    </div>
                    <div className='gameInfo hoverShown' style={{width:'30vw'}}> {game.detail} </div>
                    <div className='rightButton hoverShown'>
                        <button className="buttonEdit" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry"><AiOutlineEdit /></button>
                        <button className="buttonRemove" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" ><MdClose /></button>
                    </div>
                </Row>
            }
        </div>
    )
});

export default Game