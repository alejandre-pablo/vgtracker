import React, {useEffect, useReducer, useState} from 'react';
import { Rating } from 'react-simple-star-rating';
import { Row, Col, Form, FloatingLabel, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { gameReducer, defaultGame }from './utils/gameFormReducer';

const AddForm = (props) => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})
    const navigate = useNavigate();

    const shouldShow = props.show;
    const gameId = props.gameId;
    const k = 'd068d12dda5d4c8283eaa6167fe26f79'

    const [game, dispatch] = useReducer(gameReducer, defaultGame);
    const [show, setShow] = useState(false);
    const [fetched, setFetched] = useState(false);

    const defaultPlatforms = 
        <>
        <option value="" disabled hidden>Platform</option>
        <option value="Steam">Steam</option>
        <option value="Xbox Game Pass">Xbox Game Pass</option>
        <option value="Epic Games">Epic Games</option>
        <option value="PC" >PC</option>
        <option value="Nintendo Switch">Nintendo Switch</option>
        <option value="PS4">PS4</option>
        <option value="PS5">PS5</option>
        <option value="Xbox">Xbox</option>
        </>
    const [gamePlatforms, setGamePlatforms] = useState([]);
    const searchedGamePlatforms = 
    <>
        <option key="placeholder" value="" disabled hidden>Platform</option>
        {gamePlatforms.map((platform) => (
            <option key={platform.platform.name} value={platform.platform.name}>{platform.platform.name}</option>      
        ))}
    </>
    
    useEffect (() => {
        if(shouldShow === true) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [shouldShow]);

    function handleShow() {
        if(gameId !== game.id){
            setFetched(false);
            handleOpen(gameId);
        }
    }

    function handleEdit(fields) {
        dispatch({
            type: 'edited',
            fields: fields
        });
    }

    function handleClear() {
        dispatch({
            type: 'cleared',
        });
    }

    function handleSubmit() {
        return {
            id: game.id,
            title: game.title,
            developer: game.developer,
            publisher: game.publisher,
            genres: game.genres,
            platform: game.platform,
            playtime: game.playtime,
            rating: game.rating,
            playdate: game.playdate,
            playstatus: game.playstatus,
            image: game.customImage !== '' ? game.customImage : game.image,
            detail: game.detail,
        }
    }

    function handleOpen(gameId) {
        const controller = new AbortController();
        const abortSignal = controller.signal;
        if(gameId !== -1) {
            fetch(`https://api.rawg.io/api/games/${gameId}?key=${k}`, {abortSignal})
            .then( res => res.json())
            .then(result => {
                setFetched(true);
                setGamePlatforms(result.platforms)
                dispatch({
                    type: 'edited',
                    fields: {
                        id: result.id,
                        title: result.name,
                        developer: result.developers,
                        publisher: result.publishers,
                        platform: '',
                        genres: result.genres,
                        playtime: '',
                        playtimeCache: '',
                        rating: [0,0,0],
                        ratingCache: [0,0,0],
                        playdate: '',
                        playdateCache: '',
                        playstatus:'',
                        image: result.background_image,
                        detail: ''
                    }
                });
            })
        }
        return () => {
            controller.abort();
        }
    }

    function handlePlaytime (value)  {
        let regex = /(\d)*([,]?)?([0-9]{1})?/g;
        if(value.match(regex) === null) {
            handleEdit({playtime: value, playtimeCache: value})
        } else {
            if (value.match(regex).length <= 2) {
                handleEdit({playtime: value, playtimeCache: value})
            }
        }
    }

    function handlePlaystatus (value) {
        if(value === 'plantoplay') {
            handleEdit({
                playstatus: value,
                playtime: '', 
                playdate: '',
                rating: [0,0,0]
            })
        } else {
            if(game.playstatus === 'plantoplay' && (game.playdateCache === '9999' || game.playdateCache === '')) {
                handleEdit({
                    playstatus: value,
                    playtime: game.playtimeCache, 
                    playdate: new Date().getFullYear().toString(),
                    rating: game.ratingCache
                })
            } else {
                handleEdit({
                    playstatus: value,
                    playtime: game.playtimeCache, 
                    playdate: game.playdateCache,
                    rating: game.ratingCache
                })
            }
        }
    }

    const handleClose = () => {
        props.handleCloseModal();   
    }

    const enableButton = (
        game.title!== "" && game.platform !== "" && 
        (game.rating[0] !== -1 && game.rating[1] !== -1 && game.rating[2] !== -1) &&
        ((game.playdate !== "" &&  game.playtime !== "" && (game.playstatus !== "" && game.playstatus !== "plantoplay")) || game.playstatus === "plantoplay")
    )
    const handleFormSubmit = e => {
        e.preventDefault();
        let existingGames = sessionStorage.getItem('games') === '' ? null : JSON.parse(sessionStorage.getItem('games'));
        if(existingGames === null || existingGames.filter(res => (res.id === game.id)).length === 0 ) {
            navigate('/list', {state: {addedGame: handleSubmit()}})
            handleClear();
        } else {
            setShow(false);
            handleClear();
        }
    };

    return (
        <Modal show={show} onShow={handleShow} onHide={handleClose} size="lg" fullscreen={isTabletOrMobile} className="modalForm" >
        <Modal.Header closeButton>
            {fetched ? <Modal.Title>Add a new game</Modal.Title> : <Modal.Title>Loading</Modal.Title>}
        </Modal.Header>
        <Modal.Body>
            <div className="modalOverlay" style={{display: fetched === true ? 'none' : 'flex'}}> 
                <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/>
            </div>
            <Form style={{filter: fetched === true ? 'none' : 'blur(4px)'}}>
                <Row className='formGroupBordered'>
                <Form.Label className='formHeader'> Game Details </Form.Label>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='gameTitleLabel'
                    label='Game Title'
                    className='formLabel'
                    >   
                        <Form.Control type='text' className="inputText" placeholder='Title' value={game.title} onChange={e => handleEdit({title: e.target.value})} />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='platformLabel'
                    label='Platform'
                    className='formLabel'
                    >   
                        <Form.Select type='text' className="inputText" placeholder='Platform' value={game.platform} onChange={e => handleEdit({platform:e.target.value})}>
                                {fetched === true ? searchedGamePlatforms : defaultPlatforms}
                        </Form.Select>
                    </FloatingLabel>
                </Form.Group>
                </Row>
                <Row className='formGroupBordered'>
                <Form.Label className='formHeader'> Play Details </Form.Label>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='statusLabel'
                    label='Status'
                    className='formLabel'
                    >   
                        <Form.Select type='text' className="inputText" placeholder='Status' value={game.playstatus} onChange={e => handlePlaystatus(e.target.value)}>
                            <option value="" disabled hidden>Status</option>
                                <option value="finished">Finished</option>
                                <option value="playing">Playing</option>
                                <option value="onhold">On Hold</option>
                                <option value="dropped" >Dropped</option>
                                <option value="other" >Other</option>
                                <option value="plantoplay">Plan to Play</option>
                        </Form.Select>
                    </FloatingLabel>
                </Form.Group>
                
                <Form.Group className='mb-3' >
                    <FloatingLabel
                    controlId='playtimeLabel'
                    label='Playtime (Hours)'
                    className='formLabel'
                    >   
                        <Form.Control  
                        type='text' 
                        className="inputText" 
                        placeholder= '0,0' 
                        value={game.playtime} 
                        onChange={e => {handlePlaytime(e.target.value)}} 
                        readOnly = {game.playstatus === 'plantoplay'}/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='playdateLabel'
                    label='Playdate (Year)'
                    className='formLabel'
                    >   
                        <Form.Control
                        type='number' 
                        min={1000} 
                        max={9999} 
                        maxLength="4" 
                        placeholder= {new Date().getFullYear().toString()} 
                        className="inputText" 
                        value={game.playdate} 
                        onChange={e => {handleEdit({playdate: e.target.value.slice(0,4), playdateCache: e.target.value.slice(0,4)})}} 
                        readOnly = {game.playstatus === 'plantoplay'}/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                <Form.Label style={{opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}} className='ratingsLabel'> Ratings </Form.Label>
                        {isTabletOrMobile ? 
                        <Row className='ratingsRowMobile'>
                            <Row>
                                <Col md={6}>
                                    <Form.Label className='ratingsSubLabel' style={{opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Gameplay </Form.Label>
                                </Col>
                                <Col md={6}>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {handleEdit({rating: [e, game.rating[1], game.rating[2]], ratingCache:[e, game.rating[1], game.rating[2]]})}} 
                                    transition={true} 
                                    size='1.5rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#1a1c24" 
                                    readonly = {game.playstatus === 'plantoplay' ? true: false}/>
                                </Col>   
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label className='ratingsSubLabel' style={{opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Story </Form.Label>
                                </Col>
                                <Col>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {handleEdit({rating:[game.rating[0], e, game.rating[2]], ratingCache:[game.rating[0], e, game.rating[2]]})}} 
                                    ratingValue={game.rating[1]} 
                                    transition={true} 
                                    size='1.5rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#1a1c24" 
                                    readonly = {game.playstatus === 'plantoplay' ? true: false}/>
                                </Col>  
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label className='ratingsSubLabel' style={{opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Art & Music </Form.Label>
                                </Col>
                                <Col>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {handleEdit({rating:[game.rating[0], game.rating[1], e], ratingCache:[game.rating[0], game.rating[1], e]})}} 
                                    transition={true} 
                                    size='1.5rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#1a1c24" 
                                    readonly = {game.playstatus === 'plantoplay' ? true: false}/>
                                </Col>
                            </Row>
                        </Row>
                        : <Row className='ratingsRow'>
                            <Col>
                                <Row>
                                    <Form.Label className='ratingsSubLabel' style={{opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Gameplay </Form.Label>
                                </Row>
                                <Row>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {handleEdit({rating:[e, game.rating[1], game.rating[2]], ratingCache:[e, game.rating[1], game.rating[2]]})}} 
                                    ratingValue={game.rating[0]} 
                                    transition={true} 
                                    size='2.2rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#1a1c24" 
                                    readonly = {game.playstatus === 'plantoplay' ? true: false}/>
                                </Row>   
                            </Col>
                            <Col>
                                <Row>
                                    <Form.Label className='ratingsSubLabel' style={{opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Story </Form.Label>
                                </Row>
                                <Row>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {handleEdit({rating:[game.rating[0], e, game.rating[2]], ratingCache:[game.rating[0], e, game.rating[2]]})}} 
                                    ratingValue={game.rating[1]} 
                                    transition={true} 
                                    size='2.2rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#1a1c24" 
                                    readonly = {game.playstatus === 'plantoplay' ? true: false}/>
                                </Row>  
                            </Col>
                            <Col>
                                <Row>
                                    <Form.Label className='ratingsSubLabel' style={{opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Art & Music </Form.Label>
                                </Row>
                                <Row>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {handleEdit({rating:[game.rating[0], game.rating[1], e], ratingCache:[game.rating[0], game.rating[1], e]})}}  
                                    ratingValue={game.rating[2]} 
                                    transition={true} 
                                    size='2.2rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#1a1c24" 
                                    readonly = {game.playstatus === 'plantoplay' ? true: false}/>
                                </Row>
                            </Col>
                        </Row>
                    }
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='notesLabel'
                    label='Extra Details'
                    className='formLabel'
                    >   
                        <Form.Control type='text' className="inputText" placeholder='Detail' value={game.detail} onChange={e => handleEdit({detail:e.target.value})} />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3' >
                    <FloatingLabel 
                    controlId='customImageLabel'
                    label='Custom Image URL'
                    className='formLabel'
                    >   
                        <Form.Control  
                        type='text' 
                        className="inputText" 
                        placeholder= 'URL' 
                        value={game.customImage} 
                        onChange={e => {handleEdit({customImage: e.target.value})}} />
                    </FloatingLabel>
                </Form.Group>
                </Row>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <button className="buttonAdd" onClick={handleFormSubmit} disabled={ enableButton ? "" : "disabled"}>
                Add
            </button>
        </Modal.Footer>
    </Modal>
    )
}

export default AddForm
