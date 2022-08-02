import { arrayMove } from '@dnd-kit/sortable';
import React, { useState} from 'react'
import { Col, Row, Carousel  } from 'react-bootstrap';
import EditForm from './forms/EditForm';

import Game from './Game'

const ListMobile = (props) => {
    const {list, handleEditRemoveItem} = props;

    function handleRemoveItem (id)  {
        console.log(`Deleting game id ${id} from list`)
            var tmpList = list.filter((item => item.id !== id))
            handleEditRemoveItem(tmpList);
    };

    function handleUpdateItem (game)  {
        console.log(`Editing game ${game.title}`)
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
                <div className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>
                </div>))
            }
        </ul>   

    const gameListPlaying = 
        <ul>
            {list.filter(game => game.playstatus === "playing" ).map ((game, index) => (
                <div className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>
                </div>))
            }
        </ul>  

    const gameListOnHold = 
        <ul>
            {list.filter(game => game.playstatus === "onhold" ).map ((game, index) => (
                <div className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>
                </div>))
            }
        </ul>  

    const gameListDropped = 
        <ul>
            {list.filter(game => game.playstatus === "dropped" ).map ((game, index) => (
                <div className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>
                </div>))
            }
        </ul>  

    const gameListOther = 
        <ul>
            {list.filter(game => game.playstatus === "other" ).map ((game, index) => (
                <div className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id}  onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>
                </div>))
            }
        </ul>  

    const gameListPlanToPlay = 
        <ul>
            {list.filter(game => game.playstatus === "plantoplay" ).map ((game, index) => (
                <div className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game}/>
                </div>))
            }
        </ul> 

    return (
        <>
            <EditForm show ={showModal} handleCloseModal = {handleCloseModal} gameId = {gameId} updateItemHandler = {handleUpdateItem}/>
            <Col className='listColumn'>
                <Carousel interval = {null} >
                    <Carousel.Item >
                        <Row className='scrollable'> 
                            {list.length ? gameListFinished : "No games added yet"}
                        </Row>
                    </Carousel.Item>
                    <Carousel.Item >
                        <Row className='scrollable'> 
                            {list.length ? gameListPlaying : "No games added yet"}
                            
                        </Row>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Row className='scrollable'> 
                            {list.length ? gameListOnHold : "No games added yet"}
                        </Row>
                    </Carousel.Item>
                    <Carousel.Item >
                        <Row className='scrollable'> 
                            {list.length ? gameListDropped : "No games added yet"}
                        </Row>
                    </Carousel.Item>
                    <Carousel.Item >
                        <Row className='scrollable'> 
                            {list.length ? gameListOther : "No games added yet"}
                        </Row>
                    </Carousel.Item>
                    <Carousel.Item >
                        <Row className='scrollable'>
                            {list.length ? gameListPlanToPlay : "No games added yet"} 
                        </Row>
                    </Carousel.Item>
                </Carousel>
            </Col>
        </>
    )
}

export default ListMobile
