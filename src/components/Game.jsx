import React, { forwardRef } from 'react'
import { Rating } from 'react-simple-star-rating'
import { MdClose } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai'
import { Row } from 'react-bootstrap';
import { useState } from 'react';
import { IMAGES_SERVER_URL } from '../constants/urls';
import { platformNameMap } from '../constants/platforms';


const Game = forwardRef((props, ref) => {

    const {game, onClickEditItem, onClickRemoveItem} = props;

    function getCleanPlatformName(name) {
        return platformNameMap[name] || name;
    }
    return (
        <div ref={ref} className="game">
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
                    <div className='gameInfo' style={{width:'8vw'}}> {game.playdate} </div>
                    <div className='gameInfo' style={{width:'12vw'}}>
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