import React, {useEffect, useState} from 'react'
import { Rating } from 'react-simple-star-rating'
import { Row, Col, Form, FloatingLabel, Modal, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

const AddForm = (props) => {

    let k = 'd068d12dda5d4c8283eaa6167fe26f79'
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    const navigate = useNavigate();

    const shouldShow = props.show;
    const gameId = props.gameId;
    const [id, setId] = useState(-1);
    const [title, setTitle] = useState("");
    const [developer, setDeveloper] = useState([]);
    const [publisher, setPublisher] = useState([]);
    const [platform, setPlatform] = useState("");
    const [genres, setGenres] = useState([]);
    const [playtime, setPlaytime] = useState('');
    const [playtimeCache, setPlaytimeCache] = useState('');
    const [rating, setRating] = useState([0, 0, 0]);
    const [ratingCache, setRatingCache] = useState([0, 0, 0]);
    const [playdate, setPlaydate] = useState('');
    const [playdateCache, setPlaydateCache] = useState('');
    const [playstatus, setPlaystatus] = useState("");
    const [playstatusCache, setPlaystatusCache] = useState("");
    const [backgroundImage, setBackgroundImage] = useState('');
    const [detail, setDetail] = useState("");

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
            if(gameId !== id) {
                setId(gameId);
                clearData();
                setFetched(false);
            }
        } else {
            setShow(false)
        }
    }, [shouldShow]);

    useEffect (() => {
        if(playstatus === 'plantoplay') {
            setPlaydate('');
            setPlaytime('');
            setRating([0,0,0]);
        } else {
            if(playstatusCache === 'plantoplay' && playdateCache === '') {
                setPlaytime(playtimeCache);
                setPlaydate(new Date().getFullYear().toString())
                setRating(ratingCache);
            } else {
                setPlaytime(playtimeCache);
                setPlaydate(playdateCache);
                setRating(ratingCache);
            }
        }
        setPlaystatusCache(playstatus)
    }, [playstatus])


    useEffect (() => {
        const controller = new AbortController();
        const abortSignal = controller.signal;
        if(gameId !== -1 && fetched === false) {
            fetch(`https://api.rawg.io/api/games/${gameId}?key=${k}`, {abortSignal})
            .then( res => res.json())
            .then((result) => {
                setFetched(true);
                setId(result.id)
                setTitle(result.name);
                setGamePlatforms(result.platforms)
                setDeveloper(result.developers);
                setGenres(result.genres);
                setPublisher(result.publishers);
                setBackgroundImage(result.background_image);
            }).catch(error => {
                console.log(error)
            })
        }
        return () => {
            controller.abort();
        }
    }, [gameId, fetched])

    const handleClose = () => {
        props.handleCloseModal();   
    }

    const handlePlaytime = (e) => {
        let regex = /(\d)*([,]?)?([0-9]{1})?/g;
        if(e.match(regex) === null) {
            setPlaytime(e)
        } else {
            if (e.match(regex).length <= 2) {
                setPlaytime(e)
            }
            
        }
    }
    
    const clearData = () => {
        setTitle("");
        setDeveloper([]);
        setPublisher([]);
        setGenres([]);
        setPlatform("");
        setPlaytime("");
        setRating([0, 0, 0]);
        setPlaydate("");
        setPlaystatus("");
        setDetail("");
    }

    const enableButton = (
        title!== "" && 
        platform !== "" && 
        (rating[0] !== -1 && rating[1] !== -1 && rating[2] !== -1) &&
        ((playdate !== "" &&  playtime !== "" && (playstatus !== "" && playstatus !== "plantoplay")) || playstatus === "plantoplay")
    )
    const handleSubmit = e => {
        e.preventDefault();
        let existingGames = sessionStorage.getItem('games') === '' ? null : JSON.parse(sessionStorage.getItem('games'));
        if(existingGames === null || existingGames.filter(game => (game.id === id)).length === 0 ) {
            navigate('/list', {state: {addedGame: {
                'id': id,
                'title': title,
                'developer': developer,
                'publisher': publisher,
                'genres': genres,
                'platform': platform,
                'playtime': playstatus === 'plantoplay' ? "0": playtime,
                'rating': rating,
                'playdate': playstatus === 'plantoplay' ? "9999": playdate,
                'playstatus': playstatus,
                'image': backgroundImage,
                'detail': detail,
            }}})
            clearData();
        } else {
            setShow(false);
            clearData()
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" fullscreen={isTabletOrMobile} className="modalForm" >
        <Modal.Header closeButton>
            {fetched === true ? <Modal.Title>Add a new game</Modal.Title> : <Modal.Title>Loading</Modal.Title>}
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
                        <Form.Control type='text' className="inputText" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='platformLabel'
                    label='Platform'
                    className='formLabel'
                    >   
                        <Form.Select type='text' className="inputText" placeholder='Platform' value={platform} onChange={e => setPlatform(e.target.value)}>
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
                        <Form.Select type='text' className="inputText" placeholder='Status' value={playstatus} onChange={e => setPlaystatus(e.target.value)}>
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
                    <FloatingLabel style={{opacity: playstatus === 'plantoplay' ? '0.50' : '1'}}
                    controlId='playtimeLabel'
                    label='Playtime (Hours)'
                    className='formLabel'
                    >   
                        <Form.Control  
                        disabled={playstatus === 'plantoplay'}
                        type='text' 
                        className="inputText" 
                        placeholder= '0,0' 
                        value={playtime} 
                        onChange={e => {handlePlaytime(e.target.value); setPlaytimeCache(e.target.value)}} 
                        readOnly = {playstatus === 'plantoplay'}/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel style={{opacity: playstatus === 'plantoplay' ? '0.50' : '1'}}
                    controlId='playdateLabel'
                    label='Playdate (Year)'
                    className='formLabel'
                    >   
                        <Form.Control
                        disabled={playstatus === 'plantoplay'}
                        type='number' 
                        min={1000} 
                        max={9999} 
                        maxLength="4" 
                        placeholder= {new Date().getFullYear()} 
                        className="inputText" 
                        value={playdate} 
                        onChange={e => {setPlaydate(e.target.value.slice(0,4)); setPlaydateCache(e.target.value.slice(0,4))}} 
                        readOnly = {playstatus === 'plantoplay' ? true: false}/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                <Form.Label style={{opacity: playstatus === 'plantoplay' ? '0.50' : '1'}} className='ratingsLabel'> Ratings </Form.Label>
                        {isTabletOrMobile ? 
                        <Row className='ratingsRowMobile'>
                            <Row>
                                <Col md={6}>
                                    <Form.Label className='ratingsSubLabel'> Gameplay </Form.Label>
                                </Col>
                                <Col md={6}>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {setRating([e, rating[1], rating[2]]); setRatingCache([e, rating[1], rating[2]])}} 
                                    transition={true} size='1.5rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#262e33" 
                                    readonly = {playstatus === 'plantoplay' ? true: false}/>
                                </Col>   
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label className='ratingsSubLabel'> Story </Form.Label>
                                </Col>
                                <Col>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {setRating([rating[0], e, rating[2]]); setRatingCache([rating[0], e, rating[2]])}} 
                                    ratingValue={rating[1]} 
                                    transition={true} 
                                    size='1.5rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#262e33" 
                                    readonly = {playstatus === 'plantoplay' ? true: false}/>
                                </Col>  
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label className='ratingsSubLabel'> Art & Music </Form.Label>
                                </Col>
                                <Col>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {setRating([rating[0], rating[1], e]); setRatingCache([rating[0], rating[1], e])}} 
                                    transition={true} size='1.5rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#262e33" 
                                    readonly = {playstatus === 'plantoplay' ? true: false}/>
                                </Col>
                            </Row>
                        </Row>
                        : <Row className='ratingsRow'>
                            <Col>
                                <Row>
                                    <Form.Label className='ratingsSubLabel'> Gameplay </Form.Label>
                                </Row>
                                <Row>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {setRating([e, rating[1], rating[2]]); setRatingCache([e, rating[1], rating[2]])}} 
                                    ratingValue={rating[0]} 
                                    transition={true} 
                                    size='2.2rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#262e33" 
                                    readonly = {playstatus === 'plantoplay' ? true: false}/>
                                </Row>   
                            </Col>
                            <Col>
                                <Row>
                                    <Form.Label className='ratingsSubLabel'> Story </Form.Label>
                                </Row>
                                <Row>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {setRating([rating[0], e, rating[2]]); setRatingCache([rating[0], e, rating[2]])}} 
                                    ratingValue={rating[1]} 
                                    transition={true} 
                                    size='2.2rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#262e33" 
                                    readonly = {playstatus === 'plantoplay' ? true: false}/>
                                </Row>  
                            </Col>
                            <Col>
                                <Row>
                                    <Form.Label className='ratingsSubLabel'> Art & Music </Form.Label>
                                </Row>
                                <Row>
                                    <Rating 
                                    className='ratingsStars' 
                                    onClick={e => {setRating([rating[0], rating[1], e]); setRatingCache([rating[0], rating[1], e])}} 
                                    ratingValue={rating[2]} 
                                    transition={true} 
                                    size='2.2rem' 
                                    fillColor ={'#fff'} 
                                    emptyColor= "#262e33" 
                                    readonly = {playstatus === 'plantoplay' ? true: false}/>
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
                        <Form.Control type='text' className="inputText" placeholder='Detail' value={detail} onChange={e => setDetail(e.target.value)} />
                    </FloatingLabel>
                </Form.Group>
                </Row>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <button className="buttonAdd" onClick={handleSubmit} disabled={ enableButton ? "" : "disabled"}>
                Add
            </button>
        </Modal.Footer>
    </Modal>
    )
}

export default AddForm
