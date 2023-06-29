import React, {useEffect, useState, useReducer} from 'react';
import { Rating } from 'react-simple-star-rating';
import { Row, Col, Form, FloatingLabel, Modal } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { gameReducer, defaultGame }from './utils/gameFormReducer';
import { useLocation, useNavigate } from 'react-router-dom';

const EditForm = (props) => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    const navigate = useNavigate();
    const location = useLocation();

    const shouldShow = props.show;
    const gameId = props.gameId;
    const updateItem = props.updateItemHandler;

    const [game, dispatch] = useReducer(gameReducer, defaultGame);
    const [show, setShow] = useState(false);

    useEffect (() => {
        if(shouldShow === true) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [shouldShow]);

    function handleClose() {
        handleClear();
        props.handleCloseModal();   
    }
    
    function handleShow() {
        if(gameId !== game.id){
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
        if(gameId.id !== -1) {
            let existingGames = JSON.parse(sessionStorage.getItem('games'));
            let gameOpened = existingGames.filter(res => (res.id === gameId))[0]
            dispatch({
                type: 'edited',
                fields: {...gameOpened,
                    playtimeCache: gameOpened.playtime,
                    playdateCache: gameOpened.playdate,
                    ratingCache: gameOpened.rating
                }
            })
        }
    }


    function handlePlaytime (value)  {
        let regex = new RegExp(/^-?\d*[,]?\d{0,2}$/);
        if(regex.test(value)) {
            handleEdit({playtime: value, playtimeCache: value})
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

    const enableButton = (game.playtime !== "" && game.playdate !== "" && game.playstatus !== "" && game.playstatus !== "plantoplay") || (game.playstatus === "plantoplay" )
    const handleFormSubmit = e => {
        e.preventDefault();
        updateItem(handleSubmit());
        setShow(false);
        handleClear();
        handleClose();
        if(location.pathname !== '/list') {
            navigate('/list')
        }
    };

    return (
        <Modal show={show} onHide={handleClose} onShow={handleShow} size="lg" fullscreen={isTabletOrMobile} className="modalForm">
        <Modal.Header closeButton>
            <Modal.Title>Edit game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Row className='formGroupBordered' style={{paddingBottom: '0'}}>
                <Form.Label className='formHeader'> Game Details </Form.Label>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='gameTitleLabel'
                    label='Game Title'
                    className='formLabel'
                    style={{opacity: '0.5'}}
                    >   
                        <Form.Control type='text' className="inputText" placeholder='Title' value={game.title} disabled/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='platformLabel'
                    label='Platform'
                    className='formLabel'
                    style={{opacity: '0.5'}}
                    >   
                        <Form.Control type='text' className="inputText" placeholder='Platform' value={game.platform} disabled/>
                    </FloatingLabel>
                </Form.Group>
                </Row>
                <Row className='formGroupBordered' style={{paddingBottom: '0'}}>
                <Form.Label className='formHeader'> Play Details </Form.Label>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='statusLabel'
                    label='Status'
                    className='formLabel'
                    >   
                        <Form.Select type='text' className="inputText" placeholder='Status' value={game.playstatus} onChange={e => handlePlaystatus(e.target.value)}>
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
                    style={{opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}
                    >   
                        <Form.Control 
                        type='text' 
                        className="inputText" 
                        placeholder= '0,0' 
                        value={game.playtime} 
                        onChange={e => {handlePlaytime(e.target.value)} }
                        disabled = {game.playstatus === 'plantoplay'}/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='playdateLabel'
                    label='Playdate (Year)'
                    className='formLabel'
                    style={{opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}
                    >   
                        <Form.Control
                        type='number' 
                        min={1000} 
                        max={9999} 
                        maxLength="4" 
                        placeholder= {new Date().getFullYear().toString()} 
                        className="inputText" 
                        value={game.playdate} 
                        onChange={e => {handleEdit({playdate: e.target.value.slice(0,4), playdateCache: e.target.value.slice(0,4)})} }
                        disabled = {game.playstatus === 'plantoplay'}/>
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
                                    onClick={e => {handleEdit({rating:[e, game.rating[1], game.rating[2]], ratingCache:[e, game.rating[1], game.rating[2]]})} }
                                    initialValue={game.rating[0]} 
                                    transition={true} 
                                    size='1.5rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#121318" 
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
                                    onClick={e => {handleEdit({rating:[game.rating[0], e, game.rating[2]], ratingCache:[game.rating[0], e, game.rating[2]]})} }
                                    initialValue={game.rating[1]} 
                                    transition={true} 
                                    size='1.5rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#121318" 
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
                                    onClick={e => {handleEdit({rating:[game.rating[0], game.rating[1], e], ratingCache: [game.rating[0], game.rating[1], e]})} }
                                    initialValue={game.rating[2]} 
                                    transition={true} 
                                    size='1.5rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#121318" 
                                    readonly = {game.playstatus === 'plantoplay' ? true: false}/>
                                </Col>
                            </Row>
                        </Row>
                        : <Row className='ratingsRow' >
                            <Col>
                                <Row>
                                    <Form.Label className='ratingsSubLabel' style={{display: 'flex', justifyContent: 'center', opacity: game.playstatus === 'plantoplay' ? '0.50' : '1'}}> Gameplay </Form.Label>
                                </Row>
                                <Row>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {handleEdit({rating: [e, game.rating[1], game.rating[2]], ratingCache:[e, game.rating[1], game.rating[2]]})} }
                                    initialValue={game.rating[0]} 
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
                                    onClick={e => {handleEdit({rating:[game.rating[0], e, game.rating[2]], ratingCache:[game.rating[0], e, game.rating[2]]})} }
                                    initialValue={game.rating[1]} 
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
                                    onClick={e => {handleEdit({rating: [game.rating[0], game.rating[1], e]}); handleEdit({ratingCache: [game.rating[0], game.rating[1], e]})}} 
                                    initialValue={game.rating[2]} 
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
                        <Form.Control type='text' className="inputText" placeholder= 'URL' value={game.customImage} onChange={e => {handleEdit({customImage: e.target.value})}} />
                    </FloatingLabel>
                </Form.Group>
                </Row>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <button className="buttonAdd" onClick={handleFormSubmit} disabled={ enableButton ? "" : "disabled"}>
                Edit
            </button>
        </Modal.Footer>
    </Modal>
    )
}

export default EditForm
