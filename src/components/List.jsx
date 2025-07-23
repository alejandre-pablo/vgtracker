import React, { useEffect, useState } from 'react';
import { Tab, Nav, Col, Row, Spinner, Dropdown } from 'react-bootstrap';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { TbCalendarUp, TbCalendarDown, TbClockUp, TbClockDown } from 'react-icons/tb';
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown, FaStar, FaSort } from 'react-icons/fa';

import { useSearch } from './contexts/SearchContext';
import SharedGame from './SharedGame';
import Game from './Game';
import SortableGame from './SortableGame';
import SharedProfileCard from './SharedProfileCard';
import EditForm from './forms/EditForm';

import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import useListLogic from '../hooks/useListLogic';

const List = ({list, userId = null, editable = false, isListLoaded, isEmptyList, onEditItem, onRemoveItem, onReorderList }) => {

    const {mutableList,
        activeTab,
        activeId,
        dragGame,
        listCategoriesWithCounts,
        sortingCache,
        setSortingCache,
        isSorted,
        isFilteredSearch,
        setActiveTab,
        handleSort,
        handleChangeIndex,
        handleDragStart,
        handleDragEnd
    } = useListLogic(list, { editable, onReorderList });

    const [gameData, setGameData] = useState({});
    const [showModal, setShowModal] = useState(false);

    function handleShowEditModal(id) {
        setGameData(list.find(game => game.id === id));
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }


    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 2 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const sortIcons = {
        'title-asc': <FaSortAlphaDown />,
        'title-desc': <FaSortAlphaUp />,
        'rating-asc': <FaStar />,
        'rating-desc': <FaStar />,
        'playtime-asc': <TbClockUp />,
        'playtime-desc': <TbClockDown />,
        'playdate-asc': <TbCalendarUp />,
        'playdate-desc': <TbCalendarDown />,
        'order-default': <FaSortAmountDown />
    };

    const listHeader =
        <Row className='listHeader'>
            <div className='columnTitle gameSortWrapper'>#</div>
            <div className='columnTitle' style={{ width: '9vw' }}></div>
            <div className='columnTitle' style={{ width: '22vw', cursor: 'pointer' }} onClick={() => handleSort('title')}>
                TITLE {sortingCache[0] === 'title' && (sortingCache[1] === 'asc' ? <AiFillCaretUp /> : <AiFillCaretDown />)}
            </div>
            <div className='columnTitle' style={{ width: '10vw', cursor: 'pointer' }} onClick={() => handleSort('platform')}>
                PLATFORM {sortingCache[0] === 'platform' && (sortingCache[1] === 'asc' ? <AiFillCaretUp /> : <AiFillCaretDown />)}
            </div>
            <div className='columnTitle' style={{ width: '10vw', cursor: 'pointer' }} onClick={() => handleSort('playtime')}>
                PLAYTIME {sortingCache[0] === 'playtime' && (sortingCache[1] === 'asc' ? <AiFillCaretUp /> : <AiFillCaretDown />)}
            </div>
            <div className='columnTitle' style={{ width: '8vw', cursor: 'pointer' }} onClick={() => handleSort('playdate')}>
                DATE {sortingCache[0] === 'playdate' && (sortingCache[1] === 'asc' ? <AiFillCaretUp /> : <AiFillCaretDown />)}
            </div>
            <div className='columnTitle' style={{ width: '12vw', cursor: 'pointer' }} onClick={() => handleSort('rating')}>
                RATING {sortingCache[0] === 'rating' && (sortingCache[1] === 'asc' ? <AiFillCaretUp /> : <AiFillCaretDown />)}
            </div>
            <div className='columnTitle' style={{ flex: 1 }}>
                <Dropdown>
                <Dropdown.Toggle className="faIconButton">
                    {sortIcons[`${sortingCache[0]}-${sortingCache[1]}`] || <FaSortAlphaDown />}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortingCache(['title', 'asc'])}>Title A-Z</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortingCache(['title', 'desc'])}>Title Z-A</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortingCache(['rating', 'desc'])}>Top Rated</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortingCache(['playtime', 'desc'])}>Longest Played</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortingCache(['order', 'default'])}>Default Order</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </div>
        </Row>;

    const listHeaderPlanToPlay =
        <Row className='listHeader'>
        <div className='columnTitle gameSortWrapper'>#</div>
        <div className='columnTitle' style={{ width: '9vw' }}></div>
        <div className='columnTitle' style={{ width: '22vw' }}>TITLE</div>
        <div className='columnTitle' style={{ width: '37vw' }}></div>
        </Row>;

    const listCategories = [
        { key: "All", label: "ALL GAMES", filter: () => true, header: listHeader },
        { key: "Finished", label: "COMPLETED", filter: game => game.playstatus === "finished", header: listHeader },
        { key: "Playing", label: "PLAYING", filter: game => game.playstatus === "playing", header: listHeader },
        { key: "OnHold", label: "ON HOLD", filter: game => game.playstatus === "onhold", header: listHeader },
        { key: "Dropped", label: "DROPPED", filter: game => game.playstatus === "dropped", header: listHeader },
        { key: "Other", label: "OTHER", filter: game => game.playstatus === "other", header: listHeader },
        { key: "PlanToPlay", label: "PLAN TO PLAY", filter: game => game.playstatus === "plantoplay", header: listHeaderPlanToPlay }
    ];

    const generateGameList = (games) => (
        <ul>
        {games.map((game, index) => (
            <li key={game.id} className={index % 2 === 0 ? 'highlight' : ''}>
            {editable ? (
                <SortableGame
                id={game.id}
                onChangeIndex={handleChangeIndex}
                index={index + 1}
                isFiltered={isSorted || isFilteredSearch}
                >
                <Game game={game} onClickEditItem={onEditItem && handleShowEditModal} onClickRemoveItem={onRemoveItem} />
                </SortableGame>
            ) : (
                <Row className='gameWrapper'>
                <div className='gameSortWrapper'><span className='gameSortIndex'>{index + 1}</span></div>
                <SharedGame game={game} />
                </Row>
            )}
            </li>
        ))}
        </ul>
    );

    return (
        <>
        {editable && <EditForm show={showModal} handleCloseModal={handleCloseModal} gameData={gameData} updateItemHandler={onEditItem} />}
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Row>
                <Col className='sideBarColumn'>
                    {editable && !userId ? null : <SharedProfileCard userId={userId} list={list} />}
                    <Nav variant="pills" className="flex-column tabSelectors">
                    {listCategoriesWithCounts.map(cat => (
                        <Nav.Item key={cat.key}><Nav.Link eventKey={cat.key}>{cat.label}</Nav.Link></Nav.Item>
                    ))}
                    </Nav>
                </Col>
                <Col className='listColumn'>
                    {editable ? (
                        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                            <Tab.Content>
                                <Tab.Pane eventKey={activeTab}>
                                    {(() => {
                                    const category = listCategories.find(cat => cat.key === activeTab);
                                    const games = mutableList.filter(category.filter);
                                    return (
                                        <>
                                        {category.header}
                                        <Row className='scrollable'>
                                            <SortableContext items={games.map(g => g.id)} strategy={verticalListSortingStrategy}>
                                            {!isListLoaded ? (
                                                <Spinner animation='grow' variant='light' style={{ marginTop: '50%', margin: 'auto' }}/>
                                            ) : isEmptyList ? (
                                                <span className='emptyListMessage'>Start by adding some games</span>
                                            ) : games.length === 0 ? (
                                                <span className='emptyListMessage'>No games to show</span>
                                            ) : generateGameList(games)}
                                            </SortableContext>
                                        </Row>
                                        </>
                                    );
                                    })()}
                                </Tab.Pane>
                            </Tab.Content>
                            <DragOverlay wrapperElement="div" modifiers={[restrictToWindowEdges]} dropAnimation={null}>
                                {activeId && (
                                    <div className='dragOverlayWrapper'>
                                        <span className='gameSortHandle'><FaSort /></span>
                                        <Game game={dragGame} onClickEditItem={onEditItem && handleShowEditModal} onClickRemoveItem={onRemoveItem} />
                                    </div>
                                )}
                            </DragOverlay>
                        </DndContext>
                    ) : (
                        <Tab.Content>
                            {listCategoriesWithCounts.map(cat => {
                            const games = mutableList.filter(cat.filter);
                            return (
                                <Tab.Pane eventKey={cat.key} key={cat.key}>
                                {activeTab === 'PlanToPlay' ? listHeaderPlanToPlay : listHeader}
                                <Row className='scrollable'>
                                    {!isListLoaded ? (
                                    <Spinner animation='grow' variant='light' style={{ marginTop: '50%', margin: 'auto' }}/>
                                    ) : list.length === 0 ? (
                                    <span className='emptyListMessage'>Start by adding some games</span>
                                    ) : games.length === 0 ? (
                                    <span className='emptyListMessage'>No games to show</span>
                                    ) : generateGameList(games)}
                                </Row>
                                </Tab.Pane>
                            );
                            })}
                        </Tab.Content>
                    )}
                </Col>
            </Row>
        </Tab.Container>
        </>
    );
};

export default List;
