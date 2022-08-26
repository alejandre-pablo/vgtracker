import React, { useState} from 'react'
import { Col, Row} from 'react-bootstrap';
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
                        <div style={{background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, #66cc66 100%)'}}>COMPLETED</div>
                    </Row>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, #ffcc80 100%)'}}>PLAYING</div>
                    </Row>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, #6080cc 100%)'}}>ON HOLD</div>
                    </Row>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, #ff8080 100%)'}}>DROPPED</div>
                    </Row>
                    <Row className='mobileTabTitle'> 
                        <div style={{background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, #ffff80 100%)'}}>OTHER</div>
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
                    style={{maxHeight: 'min-content'}}
                    swipe={false}>
                    <Row className='scrollableMobile'> 
                        {list.length ? gameListFinished : "No games added yet"}
                    </Row>
                    <Row className='scrollableMobile'> 
                        {list.length ? gameListPlaying : "No games added yet"}
                    </Row>
                    <Row className='scrollableMobile'> 
                        {list.length ? gameListOnHold : "No games added yet"}
                    </Row>
                    <Row className='scrollableMobile'> 
                        {list.length ? gameListDropped : "No games added yet"}
                    </Row>
                    <Row className='scrollableMobile'> 
                        {list.length ? gameListOther : "No games added yet"}
                    </Row>
                    <Row className='scrollableMobile'>
                        {list.length ? gameListPlanToPlay : "No games added yet"} 
                    </Row>
                </Slider>
            </Col>
        </>
    )
}

export default ListMobile
