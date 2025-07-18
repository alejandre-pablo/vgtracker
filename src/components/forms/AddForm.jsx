import React, {useEffect, useReducer, useState} from 'react';
import { Rating } from 'react-simple-star-rating';
import { Row, Col, Form, FloatingLabel, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { gameReducer, defaultGame }from './utils/gameFormReducer';
import { IMAGES_SERVER_URL } from '../../constants/urls';

const AddForm = (props) => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})
    const navigate = useNavigate();

    const shouldShow = props.show;
    const gameData = props.gameData;

    const [game, dispatch] = useReducer(gameReducer, defaultGame);
    const [show, setShow] = useState(false);

    const [gamePlatforms, setGamePlatforms] = useState([]);
    const searchedGamePlatforms = 
    <>
        <option key="placeholder" value="" disabled hidden>Select a platform</option>
        {gamePlatforms.map((platform) => (
            <option key={platform.id} value={platform.id}>{platform.name}</option>      
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
        if(gameData.id !== game.id){
            handleClear();
            handleOpen(gameData);
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
            imageId: game.imageId,
            detail: game.detail,
        }
    }

    function handleOpen(gameData) {
        setGamePlatforms(gameData.platforms)
        dispatch({
            type: 'edited',
            fields: {
                id: gameData.id,
                title: gameData.name,
                developer: gameData.developer,
                publisher: gameData.publisher,
                platform: '',
                genres: gameData.genres,
                playtime: '',
                playtimeCache: '',
                rating: [0,0,0],
                ratingCache: [0,0,0],
                playdate: '',
                playdateCache: '',
                playstatus:'',
                imageId: gameData.imageId,
                detail: ''
            }
        });
    }
    
    function handleEditPlatform (value) {
        let platform = gamePlatforms.find(p => p.id === parseInt(value))
        handleEdit({platform: platform})
    }

    function handleEditPlaytime (value)  {
        let regex = new RegExp(/^-?\d*[,]?\d{0,2}$/);
        if(regex.test(value)) {
            handleEdit({playtime: value, playtimeCache: value})
        }
    }

    function handleEditPlaystatus (value) {
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
        game.title!== "" && game.platform.id && 
        (game.rating[0] !== -1 && game.rating[1] !== -1 && game.rating[2] !== -1) &&
        ((game.playdate !== "" &&  game.playtime !== "" && (game.playstatus !== "" && game.playstatus !== "plantoplay")) || game.playstatus === "plantoplay")
    )
    const handleFormSubmit = e => {
        e.preventDefault();
        let existingGames = sessionStorage.getItem('games') === '' ? null : JSON.parse(sessionStorage.getItem('games'));
        if(existingGames === null || existingGames.filter(res => (res.id === game.id)).length === 0 ) {
            navigate('/list', {state: {addedGame: handleSubmit()}})
        } else {
            setShow(false);
        }
    };

    return (
        <Modal show={show} onShow={handleShow} onHide={handleClose} size="lg" fullscreen={isTabletOrMobile} className="modalForm" >
        <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Add a new game</Modal.Title> 
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Row className='gameDetailsWrapper'>
                    <Col md='3' className='formImageWrapper'>
                        <img className='formImage' src={IMAGES_SERVER_URL.T_720P + game.imageId + '.jpg'} alt='Game Cover'/>
                    </Col>
                    <Col md='9' className='formGroupGameDetails'>    
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
                                <Form.Select type='text' className="inputText" placeholder= '' value={game.platform.id} onChange={e => handleEditPlatform(e.target.value)}>
                                        {searchedGamePlatforms}
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='formGroupBordered' style={{paddingBottom: '0'}}>
                    <Form.Label className='formHeader'> Play Details </Form.Label>

                    <Form.Group className='mb-3'>
                        <FloatingLabel
                        controlId='statusLabel'
                        label='Status'
                        className='formLabel'
                        >   
                            <Form.Select type='text' className="inputText" placeholder='Status' value={game.playstatus} onChange={e => handleEditPlaystatus(e.target.value)}>
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
                            onChange={e => {handleEditPlaytime(e.target.value)}} 
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
                                        <Form.Label className='ratingsSubLabel' style={{display: 'flex', justifyContent: 'center', opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Gameplay </Form.Label>
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
                                        <Form.Label className='ratingsSubLabel' style={{display: 'flex', justifyContent: 'center', opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Story </Form.Label>
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
                                        <Form.Label className='ratingsSubLabel' style={{display: 'flex', justifyContent: 'center', opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Art & Music </Form.Label>
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
