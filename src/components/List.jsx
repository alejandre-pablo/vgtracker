import React, { useState} from 'react'
import { Tab, Nav, Col, Row  } from 'react-bootstrap';
import EditForm from './forms/EditForm';

import Game from './Game'
import GamePlanToPlay from './GamePlanToPlay';

const List = (props) => {
    const {list, handleEditRemoveItem} = props;

    const onClickRemoveItem = (id) => {
        console.log(`Deleting game id ${id} from list`)
            var tmpList = list.filter((item => item.id !== id))
            handleEditRemoveItem(tmpList);
    };

    const handleUpdateItem = (game) => {
        console.log(`Editing game ${game.title}`)
        var gameIndex = list.findIndex((item => item.id === game.id))
        let tmpList = [...list];
        debugger
        tmpList.splice(gameIndex, 1);
        tmpList.push(game);
        handleEditRemoveItem(tmpList);
    }

    const [gameId, setGameId] = useState(-1);
    const [showModal, setShowModal] = useState(false);
    const handleEditGame = (id) => {
        setGameId(id);
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
 
    const gameListFinished = list.map ((game) => (
        game.playstatus === "finished" ? 
            <Game key={game.id} onClickRemoveItem ={onClickRemoveItem} onClickEditItem = {handleEditGame} game ={game} />
        : <></>  
    ));
    const gameListPlaying = list.map ((game) => (
        game.playstatus === "playing" ? 
            <Game key={game.id} onClickRemoveItem = {onClickRemoveItem} onClickEditItem = {handleEditGame} game = {game}/>
        : <></>  
    ));
    const gameListOnHold = list.map ((game) => (
        game.playstatus === "onhold" ? 
            <Game key={game.id} onClickRemoveItem = {onClickRemoveItem} onClickEditItem = {handleEditGame} game = {game} /> 
        : <></>  
    ));
    const gameListDropped = list.map ((game) => (
        game.playstatus === "dropped" ? 
            <Game key={game.id} onClickRemoveItem = {onClickRemoveItem} onClickEditItem = {handleEditGame} game = {game}/> 
        : <></>  
    ));
    const gameListPlanToPlay = list.map ((game) => (
        game.playstatus === "plantoplay" ? 
            <GamePlanToPlay key={game.id} onClickRemoveItem = {onClickRemoveItem} onClickEditItem = {handleEditGame} game = {game}/> 
        : <></>  
    ));
    const gameListOther = list.map ((game) => (
        game.playstatus === "other" ? 
            <Game key={game.id} onClickRemoveItem = {onClickRemoveItem} onClickEditItem = {handleEditGame} game = {game}/> 
        : <></>  
    ));

    const listHeader = 
    <Row className='listHeader'>
        <Col md = {4} className="columnTitle">TITLE</Col>
        <Col className='columnTitle '>PLATFORM</Col>
        <Col className='columnTitle '>PLAYTIME</Col>
        <Col className='columnTitle'>RATING</Col>
        <Col className='columnFill'><div className='bookmark'></div></Col>
    </Row>

    const listHeaderPlanToPlay = 
    <Row className='listHeader'>
        <Col md = {4} className="columnTitle">TITLE</Col>
        <Col md = {5} className='columnTitle '>PLAY DETAILS</Col>
        <Col className='columnFill'><div className='bookmark'></div></Col>
    </Row>

    return (
        <>
        <EditForm show ={showModal} handleCloseModal = {handleCloseModal} gameId = {gameId} updateItemHandler = {handleUpdateItem}/>
            <Tab.Container id="tabs" defaultActiveKey="Finished" className='gamesList'>
                <Row>
                    <Col sm = {2} className='sideBarColumn'>
                        <Nav variant="pills" className="flex-column tabSelectors">
                            <Nav.Item className='tabFinished'>
                                <Nav.Link eventKey="Finished">Completed</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabPlaying'>
                                <Nav.Link eventKey="Playing">Playing</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabOnHold'>
                                <Nav.Link eventKey="OnHold">On Hold</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabDropped'>
                                <Nav.Link eventKey="Dropped">Dropped</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabOthers'>
                                <Nav.Link eventKey="Other">Other</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabPlanToPlay'>
                                <Nav.Link eventKey="PlanToPlay">Plan to Play</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm = {10} className='listColumn'>
                        <Tab.Content>
                            <Tab.Pane eventKey="Finished" >
                                {listHeader}
                                <ul className='scrollable'>
                                    {list.length ? gameListFinished : "No games added yet"}
                                </ul>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Playing" >
                                {listHeader}
                                <ul className='scrollable'>
                                    {list.length ? gameListPlaying : "No games added yet"}
                                </ul>
                            </Tab.Pane>
                            <Tab.Pane eventKey="OnHold" >
                                {listHeader}
                                <ul className='scrollable'>   
                                    {list.length ? gameListOnHold : "No games added yet"}
                                </ul>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Dropped" >
                                {listHeader}
                                <ul className='scrollable'>
                                    {list.length ? gameListDropped : "No games added yet"}
                                </ul>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Other" >
                                {listHeader}
                                <ul className='scrollable'>
                                    {list.length ? gameListOther : "No games added yet"}
                                </ul>
                            </Tab.Pane>
                            <Tab.Pane eventKey="PlanToPlay" >
                                {listHeaderPlanToPlay}
                                <ul className='scrollable'>
                                    {list.length ? gameListPlanToPlay : "No games added yet"}
                                </ul>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </>
    )
}

export default List
