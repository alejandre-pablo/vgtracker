import React, { useState} from 'react'
import { Col, Row, Spinner} from 'react-bootstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import EditForm from './forms/EditForm';

import Game from './Game'

const ListMobile = (props) => {
    const {list, handleEditRemoveItem} = props;

    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();

    function handleRemoveItem (id)  {
        var tmpList = list.filter((item => item.id !== id))
        handleEditRemoveItem(tmpList);
    };

    function handleUpdateItem (game)  {
        var gameIndex = list.findIndex((item => item.id === game.id))
        let tmpList = [...list];
        tmpList.splice(gameIndex, 1);
        tmpList.push(game);
        handleEditRemoveItem(tmpList);
    }

    const [gameId, setGameId] = useState(-1);
    const [showModal, setShowModal] = useState(false);
    function handleEditGame(id) {
        setGameId(id);
        setShowModal(true);
    }
    function handleCloseModal() {
        setShowModal(false);
    }
    
    const gameListFinished = 
        <ul>
            {list.filter(game => game.playstatus === "finished" ).map ((game, index) => (
                <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>))
            }
        </ul>   

    const gameListPlaying = 
        <ul>
            {list.filter(game => game.playstatus === "playing" ).map ((game, index) => (
                <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>))
            }
        </ul>  

    const gameListOnHold = 
        <ul>
            {list.filter(game => game.playstatus === "onhold" ).map ((game, index) => (
                <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>))
            }
        </ul>  

    const gameListDropped = 
        <ul>
            {list.filter(game => game.playstatus === "dropped" ).map ((game, index) => (
                <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>))
            }
        </ul>  

    const gameListOther = 
        <ul>
            {list.filter(game => game.playstatus === "other" ).map ((game, index) => (
                <Game key = {game.id} id={game.id}  onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>))
            }
        </ul>  

    const gameListPlanToPlay = 
        <ul>
            {list.filter(game => game.playstatus === "plantoplay" ).map ((game, index) => (
                <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>))
            }
        </ul> 

    return (
        <>
            <EditForm show ={showModal} handleCloseModal = {handleCloseModal} gameId = {gameId} updateItemHandler = {handleUpdateItem}/>
            <Col className='listColumn'>
                <Slider asNavFor={nav2} ref={(slider1) => setNav1(slider1)} className='mobileTabTitleWrapper'>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: '#66cc66bb'}}>COMPLETED</div>
                    </Row>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: '#ffcc80bb'}}>PLAYING</div>
                    </Row>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: '#6080ccbb'}}>ON HOLD</div>
                    </Row>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: '#ff8080bb'}}>DROPPED</div>
                    </Row>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: '#ffff80bb'}}>OTHER</div>
                    </Row>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(128,77,153,1) 100%)'}}>PLAN TO PLAY</div>
                    </Row>
                </Slider>
                <Slider 
                    asNavFor={nav1} 
                    ref={(slider2) => setNav2(slider2)} 
                    slidesToShow={1} 
                    arrows={false} 
                    style={{height: '100%'}}
                    swipe={false}>
                    <Row className='scrollableMobile d-flex justify-content-center' >
                        {!list.length ? <Spinner animation='grow' variant='primary' style={{marginTop: '50%'}}/> : 
                        list.length === 0 ? "No games added yet"
                        : gameListFinished
                        }
                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!list.length ? <Spinner animation='grow' variant='primary' style={{marginTop: '50%'}}/> : 
                            list.length === 0 ? "No games added yet"
                        : gameListPlaying
                        }
                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!list.length ? <Spinner animation='grow' variant='primary' style={{marginTop: '50%'}}/> : 
                        list.length === 0 ? "No games added yet"
                        : gameListOnHold
                        }
                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!list.length ? <Spinner animation='grow' variant='primary' style={{marginTop: '50%'}}/> : 
                        list.length === 0 ? "No games added yet"
                        : gameListDropped
                        }
                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!list.length ? <Spinner animation='grow' variant='primary' style={{marginTop: '50%'}}/> : 
                        list.length === 0 ? "No games added yet"
                        : gameListOther
                        }
                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!list.length ? <Spinner animation='grow' variant='primary' style={{marginTop: '50%'}}/> : 
                        list.length === 0 ? "No games added yet"
                        : gameListPlanToPlay
                        }
                    </Row>
                </Slider>
            </Col>
        </>
    )
}

export default ListMobile
