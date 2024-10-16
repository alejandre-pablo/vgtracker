import { DndContext, KeyboardSensor, useSensor, useSensors, closestCenter, DragOverlay, PointerSensor } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { Tab, Nav, Col, Row, Spinner } from 'react-bootstrap';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import EditForm from './forms/EditForm';

import Game from './Game'
import SortableGame from './SortableGame';

const List = (props) => {
    const {list, isEmptyList, isListLoaded, handleEditItem, handleRemoveItem, handleSorting, handleOrderList} = props;

    const [sortingCache, setSortingCache] = useState(['order', 'default'])
    const [isSorted, setIsSorted] = useState(false);

    const [gameId, setGameId] = useState(-1);
    const [showModal, setShowModal] = useState(false);

    const [activeId, setActiveId] = useState(null);
    const [dragGame, setDragGame] = useState({});

    function handleSort (sorting) {
        if(sortingCache[0] === sorting) {
            if (sortingCache[1] === 'asc') {
                setSortingCache([sorting,'desc'])
                setIsSorted(true);
            } else {
                setSortingCache(['order','default'])
                setIsSorted(false);
            }
        } else {
            setSortingCache([sorting, 'asc'])
            setIsSorted(true);
        }
    }

    useEffect(() => {
        if(list.length > 0) {
            handleSorting(sortingCache);
        }
    }, [sortingCache])

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
    
    function handleDragStart(event) {
        setDragGame(list.find(game => game.id === event.active.id))
        setActiveId(event.active.id);
    }
    
    function handleDragEnd(event) {
        if(!isSorted) {
            const { active, over } = event;
            if (active.id !== over.id) {
                    const oldIndex = list.findIndex(item => item.id === active.id);
                    const newIndex = list.findIndex(item => item.id === over.id);
                    const tmpList =  arrayMove(list, oldIndex, newIndex);
                    handleOrderList(tmpList);
            };
        };
    }
 
    const gameListFinished = 
        <ul>
            {list.filter(game => game.playstatus === "finished" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1} isSorted={isSorted}/>
                </li>))
            }
        </ul>   

    const gameListPlaying = 
        <ul>
            {list.filter(game => game.playstatus === "playing" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1} isSorted={isSorted}/>
                </li>))
            }
        </ul>  

    const gameListOnHold = 
        <ul>
            {list.filter(game => game.playstatus === "onhold" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1} isSorted={isSorted}/>
                </li>))
            }
        </ul>  

    const gameListDropped = 
        <ul>
            {list.filter(game => game.playstatus === "dropped" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1} isSorted={isSorted}/>
                </li>))
            }
        </ul>  

    const gameListOther = 
        <ul>
            {list.filter(game => game.playstatus === "other" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1} isSorted={isSorted}/>
                </li>))
            }
        </ul>  

    const gameListPlanToPlay = 
        <ul>
            {list.filter(game => game.playstatus === "plantoplay" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SortableGame key = {game.id} id={game.id} onClickRemoveItem ={handleRemoveItem} onClickEditItem = {handleEditGame} game ={game} index ={index + 1} isSorted={isSorted}/>
                </li>))
            }
        </ul> 

    const listHeader = 
    <Row className='listHeader'>
        <div className='columnTitle' style={{width:'6vw'}}> # </div>
        <div className='columnTitle' style={{width:'9vw'}}></div>
        <div className='columnTitle' style={{width:'22vw', cursor: 'default'}} onClick={() => handleSort('title')}> 
            TITLE 
            {sortingCache[0] !== 'title' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }   
        </div>
        <div className='columnTitle' style={{width:'10vw', cursor: 'default'}} onClick={() => handleSort('platform')}> 
            PLATFORM
            {sortingCache[0] !== 'platform' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
        </div>
        <div className='columnTitle' style={{width:'10vw', cursor: 'default'}} onClick={() => handleSort('playtime')}> 
            PLAYTIME
            {sortingCache[0] !== 'playtime' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            </div>
        <div className='columnTitle' style={{width:'10vw', cursor: 'default'}} onClick={() => handleSort('playdate')}>
            DATE
            {sortingCache[0] !== 'playdate' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            </div>
        <div className='columnTitle' style={{width:'15vw', cursor: 'default'}} onClick={() => handleSort('rating')}>
            RATING
            {sortingCache[0] !== 'rating' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            </div>
        <div className='columnTitle' style={{width:'6vw'}}></div>
    </Row>

    const listHeaderPlanToPlay = 
    <Row className='listHeader'>
        <div className='columnTitle' style={{width:'6vw'}}> # </div>
        <div className='columnTitle' style={{width:'9vw'}}></div>
        <div className='columnTitle' style={{width:'22vw'}}>TITLE</div>
        <div className='columnTitle' style={{width:'37vw'}}></div>
    </Row>

    return (
        <>
        <EditForm show ={showModal} handleCloseModal = {handleCloseModal} gameId = {gameId} updateItemHandler = {handleEditItem}/>
            <Tab.Container id="tabs" defaultActiveKey="Finished" className='gamesList'>
                <Row>
                    <Col className='sideBarColumn'>
                        <Nav variant="pills" className="flex-column tabSelectors">
                            <Nav.Item className='tabFinished'>
                                <Nav.Link eventKey="Finished">COMPLETED</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabPlaying'>
                                <Nav.Link eventKey="Playing">PLAYING</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabOnHold'>
                                <Nav.Link eventKey="OnHold">ON HOLD</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabDropped'>
                                <Nav.Link eventKey="Dropped">DROPPED</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabOthers'>
                                <Nav.Link eventKey="Other">OTHER</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className='tabPlanToPlay'>
                                <Nav.Link eventKey="PlanToPlay">PLAN TO PLAY</Nav.Link>
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
                                            {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                                :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                                    :gameListFinished.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                                                        :gameListFinished
                                            }
                                            
                                        </SortableContext> 
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Playing" >
                                    {listHeader}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "playing" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                                :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                                    :gameListPlaying.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                                                        :gameListPlaying
                                            }
                                        </SortableContext>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="OnHold" >
                                    {listHeader}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "onhold" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                                :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                                    :gameListOnHold.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                                                        :gameListOnHold
                                            }
                                        </SortableContext>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Dropped" >
                                    {listHeader}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "dropped" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                                :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                                    :gameListDropped.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                                                        :gameListDropped
                                            }
                                        </SortableContext>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Other" >
                                    {listHeader}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "other" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                                :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                                    :gameListOther.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                                                        :gameListOther
                                            }
                                        </SortableContext>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="PlanToPlay" >
                                    {listHeaderPlanToPlay}
                                    <Row className='scrollable'> 
                                        <SortableContext items={list.filter(game => game.playstatus === "plantoplay" ).map(item => item.id)} strategy={verticalListSortingStrategy}>
                                        {!isListLoaded ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                                :isEmptyList ? <span className='emptyListMessage'>Start by adding some games</span>
                                                    :gameListPlanToPlay.props.children.length === 0 ?  <span className='emptyListMessage'>No games to show in this category</span>
                                                        :gameListPlanToPlay
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
