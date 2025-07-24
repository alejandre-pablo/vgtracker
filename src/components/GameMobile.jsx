import React, { useState, forwardRef } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { RiArrowDropUpLine, RiArrowDropDownLine } from 'react-icons/ri';
import { HiDotsVertical } from 'react-icons/hi'
import { IoGameController } from 'react-icons/io5'
import { FaClock } from 'react-icons/fa'
import { IMAGES_SERVER_URL } from '../constants/urls';
import { platformNameMap } from '../constants/platforms';

const GameMobile = forwardRef(({ game, displayStyle, onClickOpenGameInfo }, ref) => {
  const [isCollapsed, setCollapsed] = useState(true);

  const getCleanPlatformName = (name) => platformNameMap[name] || name;

  const handleAccordion = () => setCollapsed(!isCollapsed);

  return displayStyle === "list"
    ? (<Row>
        <Col xs='2' className="gameImageWrapper">
            <img className='gameListMobileImage' src={IMAGES_SERVER_URL.T_THUMB + game.imageId + '.jpg'} alt=''/>
        </Col>
        <Col xs='9' className='gameListMobileData'>
        
            <strong className='gameTitle'> {game.title}</strong>
            <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                <span className='gameListMobileDataSecondary'> <IoGameController />{getCleanPlatformName(game.platform.name)} </span>
                <span className='gameListMobileDataSecondary'> <FaClock /> {game.playtime} h </span>
            </div>
            
        </Col>
        <Col xs='1' className='gameListMobileHandler'>
            <button className='faIconButton' onClick={(e) => onClickOpenGameInfo(game.id)}><HiDotsVertical/></button>
        </Col>
        
        
        {/* <div className='rightButton hoverShown'>
            <button className="buttonEdit" onClick={(e) => { onClickEditItem(game.id) }} title="Edit entry"><AiOutlineEdit /></button>
            <button className="buttonRemove" onClick={(e) => { onClickRemoveItem(game.id) }} title="Delete entry" ><MdClose /></button>
        </div> */}
    </Row>)
    : (<div ref={ref} className="gameMobile">
        <Card className="gameCard aspect-ratio-box">
            <div className="aspect-ratio-inner">
                <Card.Img
                src={`${IMAGES_SERVER_URL.T_720P}${game.imageId}.jpg`}
                alt="Game background"
                />
                <Card.ImgOverlay className={isCollapsed ? 'gameCardInfoCollapsed' : 'gameCardInfo'}>
                <Card.Title>
                    <div>{game.title}</div>
                    <button className="collapseInfoButton" onClick={handleAccordion}>
                    {isCollapsed ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
                    </button>
                </Card.Title>
                <Card.Body>
                    {/* <div>
                    <Rating
                        readonly
                        size={20}
                        allowFraction
                        initialValue={averageRating}
                        fillColor={averageRating === 5 ? '#FFBC0D' : '#fff'}
                        emptyColor="#121318"
                    />
                    </div> */}
                    <div>Played on {getCleanPlatformName(game.platform.name)}</div>
                    <div>{game.playtime} hours</div>
                    <div>
                    {/* <button
                        className="textButtonMobile"
                        onClick={() => onClickEditItem(game.id)}
                        title="Edit entry"
                    >
                        Edit
                    </button>
                    <span>| </span>
                    <button
                        className="textButtonMobile"
                        onClick={() => onClickRemoveItem(game.id)}
                        title="Delete entry"
                    >
                        Remove
                    </button> */}
                    </div>
                </Card.Body>
                </Card.ImgOverlay>
            </div>
        </Card>
    </div>
    )
});

export default GameMobile;
