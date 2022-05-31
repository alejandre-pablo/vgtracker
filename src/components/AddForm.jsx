import React, {useEffect, useState} from 'react'
import { Rating } from 'react-simple-star-rating'
import { Row, Col, Form, FloatingLabel, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const AddForm = (props) => {

    let k = 'd068d12dda5d4c8283eaa6167fe26f79'

    const navigate = useNavigate();

    const shouldShow = props.show;
    const gameId = props.gameId;
    const [id, setId] = useState(-1);
    const [title, setTitle] = useState("");
    const [developer, setDeveloper] = useState([]);
    const [publisher, setPublisher] = useState([]);
    const [platform, setPlatform] = useState("");
    const [genres, setGenres] = useState([]);
    const [playtime, setPlaytime] = useState("");
    const [rating, setRating] = useState([-1, -1, -1]);
    const [playdate, setPlaydate] = useState("");
    const [playstatus, setPlaystatus] = useState("");
    const [detail, setDetail] = useState("");

    const [show, setShow] = useState(false);
    const [fetched, setFetched] = useState(false);

    const defaultPlatforms = 
        <>
        <option value="" disabled hidden>Platform</option>
        <option value="STEAM">Steam</option>
        <option value="XB">Xbox Game Pass</option>
        <option value="EG">Epic Games</option>
        <option value="PC" >PC</option>
        <option value="NS">Nintendo Switch</option>
        <option value="PS4">PS4</option>
        <option value="PS5">PS5</option>
        <option value="XB">Xbox</option>
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
            if(gameId !== id && fetched === true) {
                setId(gameId);
                clearData();
                setFetched(false);
            }
        } else {
            setShow(false)
        }

        if(gameId !== -1 && fetched === false) {
            fetch(`https://api.rawg.io/api/games/${gameId}?key=${k}`).then( res => res.json()).then((result) => {
                console.log(`fetched game ${result.name}, id ${gameId} successfully`)
                setFetched(true);
                setTitle(result.name);
                setGamePlatforms(result.platforms)
                setDeveloper(result.developers);
                setGenres(result.genres);
                setPublisher(result.publishers);
            });
        }
    }, [shouldShow, gameId, fetched]);

    const handleClose = () => {
        props.handleCloseModal();   
    }
    
    const clearData = () => {
        setTitle("");
        setDeveloper([]);
        setPublisher([]);
        setGenres([]);
        setPlatform("");
        setPlaytime("");
        setRating([-1, -1, -1]);
        setPlaydate("");
        setPlaystatus("");
        setDetail("");
    }

    const enableButton = (title!== "" && platform !== "" && playtime !== "" && rating !== "" && playdate !== "" && playstatus !== "" && (playstatus !== "playing" || (playstatus === "playing" && detail !== "")))
    const handleSubmit = e => {
        e.preventDefault();
        let existingGames = JSON.parse(localStorage.getItem('games'));
        
        if(existingGames.filter(game => (game.id === id && game.platform === platform)).length === 0 ) {
            navigate('/', {state: {addedGame: {
                'id': id,
                'title': title,
                'developer': developer,
                'publisher': publisher,
                'genres': genres,
                'platform': platform,
                'playtime': playtime,
                'rating': rating,
                'playdate': playdate,
                'playstatus': playstatus,
                'detail': detail,
            }}})
            clearData();
        } else {
            console.log('duplicado')
            setShow(false);
            clearData()
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="modalForm">
        <Modal.Header closeButton>
            {fetched === true ? <Modal.Title>Add a new game</Modal.Title> : <Modal.Title>Cargando</Modal.Title>}
            
        </Modal.Header>
        <Modal.Body>
            <Form  /* className='gamesForm file-input' */ >
                <Row className='formGroup'>
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
                <Row className='formGroup'>
                <Form.Label className='formHeader'> Play Details </Form.Label>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='playtimeLabel'
                    label='Playtime'
                    className='formLabel'
                    >   
                        <Form.Control type='text' className="inputText" placeholder='00:00' value={playtime} onChange={e => setPlaytime(e.target.value)} />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='playdateLabel'
                    label='Playdate'
                    className='formLabel'
                    >   
                        <Form.Control type='text' className="inputText" placeholder={(new Date().getFullYear())} value={playdate} onChange={e => setPlaydate(e.target.value)} />
                    </FloatingLabel>
                </Form.Group>

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
                        </Form.Select>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label className='ratingsLabel'> Ratings </Form.Label>
                    <Row className='ratingsRow'>
                        <Col>
                            <Row>
                                <Form.Label className='ratingsSubLabel'> Gameplay </Form.Label>
                            </Row>
                            <Row>
                                <Rating className='ratingsStars' onClick={e => setRating([e, rating[1], rating[2]])} ratingValue={rating[0]} transition={true} size='2.2rem' emptyColor= "#262e33"/>
                            </Row>   
                        </Col>
                        <Col>
                            <Row>
                                <Form.Label className='ratingsSubLabel'> Story </Form.Label>
                            </Row>
                            <Row>
                                <Rating className='ratingsStars' onClick={e => setRating([rating[0], e, rating[2]])} ratingValue={rating[1]} transition={true} size='2.2rem' emptyColor= "#262e33"/>
                            </Row>  
                        </Col>
                        <Col>
                            <Row>
                                <Form.Label className='ratingsSubLabel'> Art & Music </Form.Label>
                            </Row>
                            <Row>
                                <Rating className='ratingsStars' onClick={e => setRating([rating[0], rating[1], e])} ratingValue={rating[2]} transition={true} size='2.2rem' emptyColor= "#262e33"/>
                            </Row>
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='notesLabel'
                    label='Extra details'
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
