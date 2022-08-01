import React, {useEffect, useState} from 'react'
import { Rating } from 'react-simple-star-rating'
import { Row, Col, Form, FloatingLabel, Modal } from 'react-bootstrap'

const EditForm = (props) => {

    const shouldShow = props.show;
    const gameId = props.gameId;
    const updateItem = props.updateItemHandler;
    const [id, setId] = useState(-1);
    const [title, setTitle] = useState("");
    const [developer, setDeveloper] = useState([]);
    const [publisher, setPublisher] = useState([]);
    const [platform, setPlatform] = useState("");
    const [genres, setGenres] = useState([]);
    const [playtime, setPlaytime] = useState('00:00');
    const [rating, setRating] = useState([0, 0, 0]);
    const [playdate, setPlaydate] = useState(new Date());
    const [playstatus, setPlaystatus] = useState("");
    const [backgroundImage, setBackgroundImage] = useState('');
    const [detail, setDetail] = useState("");

    const [show, setShow] = useState(false);
    const [fetched, setFetched] = useState(false);
    
    useEffect (() => {
        if(shouldShow === true) {
            setShow(true);
            if(gameId !== id){
                setId(gameId);
                clearData();
                setFetched(false);
            } 
        } else {
            setShow(false)
        }
        }, [shouldShow]);

        useEffect (() => {
            if(id !== -1 && fetched === false) {
                let existingGames = JSON.parse(sessionStorage.getItem('games'));
                let result = existingGames.filter(game => (game.id === id))[0]
                console.log(`locally fetched game ${result.title}, id ${id} successfully`);
                setFetched(true);
                setId(result.id)
                setTitle(result.title);
                setPlatform(result.platform);
                setPlaytime(result.playtime);
                setPlaydate(result.playdate);
                setPlaystatus(result.playstatus);
                setDeveloper(result.developer);
                setGenres(result.genres);
                setPublisher(result.publisher);
                setRating(result.rating);
                setBackgroundImage(result.image);
                setDetail(result.detail);
                }
        }, [id]);

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
        setBackgroundImage("");
        setDetail("");
    }

    const enableButton = (title!== "" && platform !== "" && playtime !== "" && rating !== "" && playdate !== "" && playstatus !== "" && (playstatus !== "plantoplay" || (playstatus === "plantoplay" && detail !== "")))
    const handleSubmit = e => {
        e.preventDefault();
        updateItem({
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
            'image': backgroundImage,
            'detail': detail,
        });
        clearData();
        setFetched(false);
        setShow(false);
        setId(-1);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} className="modalForm">
        <Modal.Header closeButton>
            {fetched === true ? <Modal.Title>Edit game</Modal.Title> : <Modal.Title>Cargando</Modal.Title>}
            
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Row className='formGroup'>
                <Form.Label className='formHeader'> Game Details </Form.Label>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='gameTitleLabel'
                    label='Game Title'
                    className='formLabel'
                    >   
                        <Form.Control type='text' className="inputText" placeholder='Title' value={title} readOnly/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='platformLabel'
                    label='Platform'
                    className='formLabel'
                    >   
                        <Form.Control type='text' className="inputText" placeholder='Platform' value={platform} readOnly/>
                    </FloatingLabel>
                </Form.Group>
                </Row>
                <Row className='formGroup'>
                <Form.Label className='formHeader'> Play Details </Form.Label>
                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='playtimeLabel'
                    label='Playtime (Hours)'
                    className='formLabel'
                    >   
                        <Form.Control type='text' className="inputText" placeholder='00:00' value={playtime} onChange={e => handlePlaytime(e.target.value)} readOnly = {playstatus=== 'plantoplay' ? true : false}/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='playdateLabel'
                    label='Playdate (Year)'
                    className='formLabel'
                    >   
                        <Form.Control type='number' min={1000} max={new Date().getFullYear()} maxLength="4" className="inputText" placeholder={(new Date().getFullYear())} value={playdate} onChange={e => setPlaydate(e.target.value.slice(0,4))} readOnly = {playstatus=== 'plantoplay' ? true : false}/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <FloatingLabel
                    controlId='statusLabel'
                    label='Status'
                    className='formLabel'
                    >   
                        <Form.Select type='text' className="inputText" placeholder='Status' value={playstatus} onChange={e => setPlaystatus(e.target.value)}>
                                <option value="finished">Finished</option>
                                <option value="playing">Playing</option>
                                <option value="onhold">On Hold</option>
                                <option value="dropped" >Dropped</option>
                                <option value="other" >Other</option>
                                <option value="plantoplay">Plan to Play</option>
                        </Form.Select>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className='mb-3' style={playstatus === 'plantoplay' ? {opacity: 0.65} : {}}>
                    <Form.Label className='ratingsLabel'> Ratings </Form.Label>
                    <Row className='ratingsRow'>
                        <Col>
                            <Row>
                                <Form.Label className='ratingsSubLabel'> Gameplay </Form.Label>
                            </Row>
                            <Row>
                                <Rating className='ratingsStars' onClick={e => setRating([e, rating[1], rating[2]])} ratingValue={rating[0]} transition={true} size='2.2rem' emptyColor= "#262e33" readonly = {playstatus === 'plantoplay' ? true: false}/>
                            </Row>   
                        </Col>
                        <Col>
                            <Row>
                                <Form.Label className='ratingsSubLabel'> Story </Form.Label>
                            </Row>
                            <Row>
                                <Rating className='ratingsStars' onClick={e => setRating([rating[0], e, rating[2]])} ratingValue={rating[1]} transition={true} size='2.2rem' emptyColor= "#262e33" readonly = {playstatus === 'plantoplay' ? true: false}/>
                            </Row>  
                        </Col>
                        <Col>
                            <Row>
                                <Form.Label className='ratingsSubLabel'> Art & Music </Form.Label>
                            </Row>
                            <Row>
                                <Rating className='ratingsStars' onClick={e => setRating([rating[0], rating[1], e])} ratingValue={rating[2]} transition={true} size='2.2rem' emptyColor= "#262e33" readonly = {playstatus === 'plantoplay' ? true: false}/>
                            </Row>
                        </Col>
                    </Row>
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
                Edit
            </button>
        </Modal.Footer>
    </Modal>
    )
}

export default EditForm
