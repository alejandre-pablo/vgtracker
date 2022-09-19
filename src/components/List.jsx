import { DndContext, KeyboardSensor, useSensor, useSensors, closestCenter, DragOverlay, PointerSensor } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState} from 'react'
import { Tab, Nav, Col, Row, Spinner  } from 'react-bootstrap';
import EditForm from './forms/EditForm';

import Game from './Game'
import SortableGame from './SortableGame';

const List = (props) => {
    const {list, handleEditRemoveItem} = props;

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

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
          })
    )

    const [activeId, setActiveId] = useState(null);
    const [dragGame, setDragGame] = useState({});
    
    function handleDragStart(event) {
        setDragGame(list.find(game => game.id === event.active.id))
        setActiveId(event.active.id);
    }
    
    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
                const oldIndex = list.findIndex(item => item.id === active.id);
                const newIndex = list.findIndex(item => item.id === over.id);
                const tmpList =  arrayMove(list, oldIndex, newIndex);
                handleEditRemoveItem(tmpList);
        };
    }
 
    const gameListFinished = 
        <ul>
            {list.filter(game => game.playstatus === "finished" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>   

    const gameListPlaying = 
        <ul>
            {list.filter(game => game.playstatus === "playing" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListOnHold = 
        <ul>
            {list.filter(game => game.playstatus === "onhold" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListDropped = 
        <ul>
            {list.filter(game => game.playstatus === "dropped" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListOther = 
        <ul>
            {list.filter(game => game.playstatus === "other" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListPlanToPlay = 
        <ul>
            {list.filter(game => game.playstatus === "plantoplay" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul> 

    const listHeader = 
    <Row className='listHeader'>
        <Col md = {2}> 
        </Col>
        <Col md = {10}>
            <Row>
                <Col md = {3} className="columnTitle" style={{marginLeft: '-1rem'}}>TITLE</Col>
                <Col md = {3} className='columnTitle'>PLATFORM</Col>
                <Col md = {1} className='columnTitle'style={{paddingLeft: '1.5rem'}}>PLAYTIME</Col>
                <Col md = {3} className='columnTitle' style={{paddingLeft: '3rem'}}>RATING</Col>
                <Col className='columnFill'><div className='bookmark'></div></Col>
            </Row>
        </Col>
        
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
                    <Col className='sideBarColumn'>
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
                    <Col className='listColumn'>
                        <DndContext 
                            sensors={sensors} 
                            collisionDetection={closestCenter} 
                            onDragStart={handleDragStart} 
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <Tab.Content>
                                <Tab.Pane eventKey="Finished" >
                                    {listHeader}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "finished" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                            {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> : 
                                            list.length === 0 ? "No games added yet"
                                            : gameListFinished
                                            }
                                        </SortableContext> 
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Playing" >
                                    {listHeader}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "playing" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                            : list.length === 0 ? "No games added yet"
                                            : gameListPlaying
                                        }
                                        </SortableContext>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="OnHold" >
                                    {listHeader}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "onhold" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                            : list.length === 0 ? "No games added yet"
                                            : gameListOnHold
                                        }
                                        </SortableContext>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Dropped" >
                                    {listHeader}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "dropped" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                            : list.length === 0 ? "No games added yet"
                                            : gameListDropped
                                        }
                                        </SortableContext>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Other" >
                                    {listHeader}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "other" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                            : list.length === 0 ? "No games added yet"
                                            : gameListOther
                                        }
                                        </SortableContext>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="PlanToPlay" >
                                    {listHeaderPlanToPlay}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "plantoplay" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                            : list.length === 0 ? "No games added yet"
                                            : gameListPlanToPlay
                                        }
                                        </SortableContext>
                                    </Row>
                                </Tab.Pane>
                            </Tab.Content>
                            <DragOverlay wrapperElement="ul" modifiers={[restrictToWindowEdges]} dropAnimation={null}>
                                {activeId ? <Game id={activeId} game={dragGame} onClickEditItem={handleEditGame} onClickRemoveItem={handleRemoveItem} /> : null}
                            </DragOverlay>
                        </DndContext>
                    </Col>
                </Row>
            </Tab.Container>
        </>
    )
}

export default List
