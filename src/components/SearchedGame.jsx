import React from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { MdOutlineEdit } from 'react-icons/md'
import { IMAGES_SERVER_URL } from '../constants/urls';

const SearchedGame = ({ gameItem, addGameHandler, editGameHandler }) => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    const game = gameItem;
    const handleShowAddModal = addGameHandler;
    const handleShowEditModal = editGameHandler;

    const listPlatforms = game.platforms?.length 
        ? game.platforms.map(p => p.name).join(' | ') 
        : '-';

    const listGenres = game.genres?.length 
        ? game.genres.map(g => g.name).slice(0, 5).join(' | ') + (game.genres.length > 5 ? ' | ...' : '')
        : '-';

    // Cover fallback
    const coverImage = game.imageId 
        ? (IMAGES_SERVER_URL.T_720P + game.imageId + '.jpg')
        : `${window.location.origin}/img/no-image.jpg`;

    // Get stored game from localStorage
    const localGames = JSON.parse(sessionStorage.getItem('games') || '[]');
    const storedGame = localGames.find(stored => stored.id === game.id);

    return (
        !isTabletOrMobile ? (
            <li className="searchedGame">
                <Row>
                    <Col sm={2}>
                        <div className='imageContainer'>
                            <img className='gameImage' src={coverImage} alt={game.name} />
                        </div>
                    </Col>
                    <Col sm={8}>
                        <Row>
                            <span className='gameInfoUncentered' style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                {game.name}
                            </span>
                        </Row>
                        <Row>
                            <span className='gameInfoUncentered' style={{ fontSize: '1rem' }}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Platforms:&nbsp;&nbsp;&nbsp;&nbsp;{listPlatforms}
                            </span>
                        </Row>
                        <Row>
                            <span className='gameInfoUncentered' style={{ fontSize: '1rem' }}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User Rating: &nbsp;&nbsp;&nbsp;&nbsp;
                                {game.rating && game.rating > 0 ? `${(((game.rating - 1) / 99) * 4 + 1).toFixed(2)}` : '-'}
                            </span>
                        </Row>
                        <Row>
                            <span className='gameInfoUncentered' style={{ fontSize: '1rem' }}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Genres:&nbsp;&nbsp;&nbsp;&nbsp;{listGenres}
                            </span>
                        </Row>
                    </Col>
                    <Col sm={2} className='buttonAddGameWrapper'>
                        {!storedGame ? (
                            <button className='buttonAddGame' onClick={() => handleShowAddModal(game.id)}>
                                + Add to list
                            </button>
                        ) : (
                            <>
                                <button className='buttonEditGame' onClick={() => handleShowEditModal(game.id)}>
                                    <MdOutlineEdit />
                                </button>
                                <button className='buttonAddGame buttonAddGameDisabled'>
                                    ✓ {storedGame.playstatus.charAt(0).toUpperCase() + storedGame.playstatus.slice(1)}
                                </button>
                            </>
                        )}
                    </Col>
                </Row>
            </li>
        ) : (
            <li className='gameMobile'>
                <Card className='gameCard'>
                    <Card.Img src={coverImage} alt="Game cover" />
                    <Card.ImgOverlay>
                        {!storedGame ? (
                            <button className='buttonAddGameMobile' onClick={() => handleShowAddModal(game.id)}>
                                + Add to list
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className='buttonAddGameMobile buttonAddGameDisabledMobile'>
                                    ✓ {storedGame.playstatus.charAt(0).toUpperCase() + storedGame.playstatus.slice(1)}
                                </button>
                                <button className='buttonEditGameMobile' onClick={() => handleShowEditModal(game.id)}>
                                    <MdOutlineEdit />
                                </button>
                            </div>
                        )}
                    </Card.ImgOverlay>
                    <Card.ImgOverlay className='searchCardInfo'>
                        <Card.Title>
                            <div>{game.name}</div>
                        </Card.Title>
                    </Card.ImgOverlay>
                </Card>
            </li>
        )
    );
}

export default SearchedGame