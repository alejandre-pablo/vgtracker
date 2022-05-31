import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { AiOutlinePlus } from 'react-icons/ai'

const SearchedGame = ({gameItem, addGameHandler}) => {
    const handleShowModal = addGameHandler;
    const game = gameItem;
    const listPlatforms = game.platforms!== null ? game.platforms.map((platform) => `${platform.platform.name}`).join(" | ") : '';
    const listTags = game.tags!== null ?(game.tags.filter((tag) => tag.language === 'eng').slice(0,5).map((tag) => `${tag.name}`).join(" | ") + (game.tags.length > 5 ? ' | ...' : '')) : '';


    return (
        <li className="searchedGame">
            <Row>
                <Col sm={2}>
                    <div className='imageContainer'>
                        <img className='gameImage' src={game.background_image} alt='' />
                        <div className='imageOverlay' onClick={() =>handleShowModal(game.id)}>
                            <AiOutlinePlus/>
                        </div>
                    </div>
                </Col>
                <Col sm={10}>
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
            </Row>  
        </li>
    )
}

export default SearchedGame