import React from 'react'
import { useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const SearchedGame = ({gameItem, addGameHandler}) => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const handleShowModal = addGameHandler;
    const game = gameItem;
    const listPlatforms = game.platforms!== null ? game.platforms.map((platform) => `${platform.platform.name}`).join(" | ") : '';
    const listTags = game.tags!== null ?(game.tags.filter((tag) => tag.language === 'eng').slice(0,5).map((tag) => `${tag.name}`).join(" | ") + (game.tags.length > 5 ? ' | ...' : '')) : '';

    const isLocalEmpty = !sessionStorage.getItem('games')
    let localMatch = !isLocalEmpty ? JSON.parse(sessionStorage.getItem('games')).filter(storedGame => (storedGame.id === game.id)) : [];
    const storedGame = localMatch.length > 0 ? localMatch[0] : {};
    
    return (
        !isTabletOrMobile 
        ?<li className="searchedGame">
            <Row>
                <Col sm={2}>
                    <div className='imageContainer'>
                        <img className='gameImage' src={game.background_image ? game.background_image : window.location.origin +'/img/no-image.jpg'} alt='' />
                    </div>
                </Col>
                <Col sm={8}>
                    <Row>
                        <span className='gameInfoUncentered'style={{marginBottom:'0.5rem'}}>{game.name}&nbsp;</span>
                    </Row>
                    <Row>  
                        <span className='gameInfoUncentered' style={{fontSize:'1rem'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Platforms: &nbsp;&nbsp;&nbsp;&nbsp;{listPlatforms !== '' ? listPlatforms : '-'}&nbsp;</span>
                    </Row>
                    <Row>   
                        <span className='gameInfoUncentered'style={{fontSize:'1rem'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User Rating: &nbsp;&nbsp;&nbsp;&nbsp;{game.rating !== 0 ? game.rating : '-'}</span>
                    </Row>
                    <Row>   
                        <span className='gameInfoUncentered'style={{fontSize:'1rem'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tags: &nbsp;&nbsp;&nbsp;&nbsp;{listTags !== '' ? listTags : '-'}</span>
                    </Row>
                </Col>
                <Col sm={2} className='buttonAddGameWrapper'>
                    {isLocalEmpty ? <button className='buttonAddGame' onClick={() =>handleShowModal(game.id)}>
                        + Add to list
                    </button>
                    : JSON.parse(sessionStorage.getItem('games')).filter(storedGame => (storedGame.id === game.id)).length === 0 
                    ? <button className='buttonAddGame' onClick={() =>handleShowModal(game.id)}>
                        + Add to list
                    </button>
                    : <button className='buttonAddGame buttonAddGameDisabled'>
                        ✓ {storedGame.playstatus.charAt(0).toUpperCase() + storedGame.playstatus.slice(1)}
                    </button>
                    }
                    
                </Col>
            </Row>  
        </li>

        :<li className='gameMobile'>
            <Card className='gameCard'>
                <Card.Img src={game.background_image} alt="Game background" />
                <Card.ImgOverlay>
                    {JSON.parse(sessionStorage.getItem('games')).filter(storedGame => (storedGame.id === game.id)).length === 0 
                        ? <button className='buttonAddGameMobile' onClick={() =>handleShowModal(game.id)}>
                            + Add to list
                        </button>
                        : <button className='buttonAddGameMobile buttonAddGameDisabledMobile'>
                            ✓ {storedGame.playstatus.charAt(0).toUpperCase() + storedGame.playstatus.slice(1)}
                        </button>
                    }
                </Card.ImgOverlay>
                <Card.ImgOverlay className= {'searchCardInfo'}>
                    <Card.Title> 
                        <div>{game.name}</div> 
                    </Card.Title>
                </Card.ImgOverlay>
            </Card>
        </li>
    )
}

export default SearchedGame