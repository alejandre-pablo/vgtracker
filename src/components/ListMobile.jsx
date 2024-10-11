import React, { useState} from 'react'
import { Col, Row, Spinner} from 'react-bootstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import EditForm from './forms/EditForm';

import Game from './Game'

const ListMobile = (props) => {
    const {list, isEmptyList, isListLoaded, handleEditItem, handleRemoveItem} = props;

    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();

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
            <EditForm show ={showModal} handleCloseModal = {handleCloseModal} gameId = {gameId} updateItemHandler = {handleEditItem}/>
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
                    swipe={false}>
                    <Row className='scrollableMobile d-flex justify-content-center' >
                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                            :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                :gameListFinished.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                                    :gameListFinished
                        }

                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                            :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                :gameListPlaying.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                                    : gameListPlaying
                        }
                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                            :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                :gameListOnHold.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                        : gameListOnHold
                        }
                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                            :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                :gameListDropped.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                        : gameListDropped
                        }
                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                            :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                :gameListOther.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                        : gameListOther
                        }
                    </Row>
                    <Row className='scrollableMobile d-flex justify-content-center'>
                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                            :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                :gameListPlanToPlay.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                        : gameListPlanToPlay
                        }
                    </Row>
                </Slider>
            </Col>
        </>
    )
}

export default ListMobile
