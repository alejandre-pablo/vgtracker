import React from 'react'
import { Col, Row } from 'react-bootstrap';

const SearchedGame = ({gameItem, addGameHandler}) => {
    const handleShowModal = addGameHandler;
    const game = gameItem;
    const listPlatforms = game.platforms!== null ? game.platforms.map((platform) => `${platform.platform.name}`).join(" | ") : '';
    const listTags = game.tags!== null ?(game.tags.filter((tag) => tag.language === 'eng').slice(0,5).map((tag) => `${tag.name}`).join(" | ") + (game.tags.length > 5 ? ' | ...' : '')) : '';

    let localMatch = JSON.parse(sessionStorage.getItem('games')).filter(storedGame => (storedGame.id === game.id));
    const storedGame = localMatch.length > 0 ? localMatch[0] : {};
    return (
        <li className="searchedGame">
            <Row>
                <Col sm={2}>
                    <div className='imageContainer'>
                        <img className='gameImage' src={game.background_image} alt='' />
                    </div>
                </Col>
                <Col sm={8}>
                    <Row>
                        <span className='gameName'>{game.name}&nbsp;</span>
                    </Row>
                    <Row>  
                        <span className='gameInfo'>&nbsp;&nbsp;&nbsp;&nbsp;Platforms: &nbsp;&nbsp;&nbsp;&nbsp;{listPlatforms !== '' ? listPlatforms : '-'}&nbsp;</span>
                    </Row>
                    <Row>   
                        <span className='gameInfo'>&nbsp;&nbsp;&nbsp;&nbsp;User Rating: &nbsp;&nbsp;&nbsp;&nbsp;{game.rating !== 0 ? game.rating : '-'}</span>
                    </Row>
                    <Row>   
                        <span className='gameInfo'>&nbsp;&nbsp;&nbsp;&nbsp;Tags: &nbsp;&nbsp;&nbsp;&nbsp;{listTags !== '' ? listTags : '-'}</span>
                    </Row>
                </Col>
                <Col sm={2} className='buttonAddGameWrapper'>
                    {JSON.parse(sessionStorage.getItem('games')).filter(storedGame => (storedGame.id === game.id)).length === 0 
                    ? <button className='buttonAddGame' onClick={() =>handleShowModal(game.id)}>
                        + Add to list
                    </button>
                    : <button className='buttonAddGameDisabled'>
                        ✓ {storedGame.playstatus.charAt(0).toUpperCase() + storedGame.playstatus.slice(1)}
                    </button>
                    }
                    
                </Col>
            </Row>  
        </li>
    )
}

export default SearchedGame