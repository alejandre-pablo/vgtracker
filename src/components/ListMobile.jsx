import React, { useState } from 'react'
import { Tab, Col, Row, Spinner, Dropdown } from 'react-bootstrap';
import { AiFillCaretDown, AiFillCaretUp, AiOutlineEdit } from 'react-icons/ai'
import { TbCalendarUp, TbCalendarDown, TbClockUp, TbClockDown, TbSettingsBolt } from 'react-icons/tb'
import { FaRegClock, FaSort, FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown, FaStar, } from 'react-icons/fa';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { IMAGES_SERVER_URL } from '../constants/urls';
import { FiInfo } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import EditForm from './forms/EditForm';
import GameMobile from './GameMobile';
import useListLogic from '../hooks/useListLogic';

import 'react-spring-bottom-sheet/dist/style.css'
import { platformNameMap } from '../constants/platforms';
import { Rating } from 'react-simple-star-rating';


const ListMobile = ({list, editable = false, isEmptyList, isListLoaded, handleEditItem, handleRemoveItem, handleOrderList}) => {

    const {mutableList,
        activeTab,
        listCategoriesWithCounts,
        sortingCache,
        setSortingCache,
        setActiveTab,
        handleSort,
    } = useListLogic(list, { editable });

    const [gameData, setGameData] = useState({});
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const getCleanPlatformName = (name) => platformNameMap[name] || name;

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

    function handleShowEditModal(id) {
        setGameData(list.find(game => game.id === id));
        setBottomSheetOpen(false);
        setShowModal(true);
    }
    function handleCloseModal() {
        setShowModal(false);
    }

    function handleOpenGameInfo (id) {
        setGameData(list.find(game => game.id === id));
        setBottomSheetOpen(true);
    }

    function handleCloseGameInfo () {
        setBottomSheetOpen(false);
    }

    /* const listHeader = 
    <Row className='listHeader'>
        <div className='columnTitle gameSortWrapper'> <span className='gameSortIndex'>#</span> </div>
        <div className='columnTitle' style={{width:'9vw'}}></div>
        <div className='columnTitle' style={{width:'22vw', cursor: 'pointer'}} onClick={() => handleSort('title')}> 
            TITLE 
            {sortingCache[0] !== 'title' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }   
        </div>
        <div className='columnTitle' style={{width:'10vw', cursor: 'pointer'}} onClick={() => handleSort('platform')}> 
            PLATFORM
            {sortingCache[0] !== 'platform' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
        </div>
        <div className='columnTitle' style={{width:'10vw', cursor: 'pointer'}} onClick={() => handleSort('playtime')}> 
            PLAYTIME
            {sortingCache[0] !== 'playtime' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            </div>
        <div className='columnTitle' style={{width:'8vw', cursor: 'pointer'}} onClick={() => handleSort('playdate')}>
            DATE
            {sortingCache[0] !== 'playdate' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            </div>
        <div className='columnTitle' style={{width:'12vw', cursor: 'pointer'}} onClick={() => handleSort('rating')}>
            RATING
            {sortingCache[0] !== 'rating' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            </div>
        <div className='columnTitle' style={{flex:'1'}}>
            <Dropdown>
                <Dropdown.Toggle className="faIconButton" id="sortingDropdown">
                    {sortIcons[`${sortingCache[0]}-${sortingCache[1]}`] || <FaSortAlphaDown />}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item className='sortDropdownItem' onClick={() => setSortingCache(['title', 'asc'])}>Title A-Z</Dropdown.Item>
                    <Dropdown.Item className='sortDropdownItem' onClick={() => setSortingCache(['title', 'desc'])}>Title Z-A</Dropdown.Item>
                    <Dropdown.Item className='sortDropdownItem' onClick={() => setSortingCache(['rating', 'desc'])}>Top Rated</Dropdown.Item>
                    <Dropdown.Item className='sortDropdownItem' onClick={() => setSortingCache(['playtime', 'desc'])}>Longest Played</Dropdown.Item>
                    <Dropdown.Item className='sortDropdownItem' onClick={() => setSortingCache(['order', 'default'])}>Default Order</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    </Row>

    const listHeaderPlanToPlay = 
    <Row className='listHeader'>
        <div className='columnTitle gameSortWrapper'> <span className='gameSortIndex'>#</span> </div>
        <div className='columnTitle' style={{width:'9vw'}}></div>
        <div className='columnTitle' style={{width:'22vw'}}>TITLE</div>
        <div className='columnTitle' style={{width:'37vw'}}></div>
    </Row> */

    const generateGameList = (games) => (
        <ul>
            {games.map((game) => (
                <li key={game.id}>
                    <GameMobile game={game} displayStyle="list" onClickOpenGameInfo = {handleOpenGameInfo} />
                </li>
            ))}
        </ul>
      );

    return (
        <>
        <Tab.Container id="tabs" className='gamesList' defaultActiveKey="Finished" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
                {/* <Col className='sideBarColumn'>
                <Nav variant="pills" className="flex-column tabSelectors">
                    {listCategoriesWithCounts.map(cat => (
                        <Nav.Item key={cat.key} className={`tab${cat.key}`}>
                        <Nav.Link eventKey={cat.key}>{cat.label}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
                </Col> */}
                <div>
                    <Tab.Content>
                    {listCategoriesWithCounts.map(cat => {
                        const filteredList = mutableList.filter(cat.filter);
                        const gameList = generateGameList(filteredList);
                        return (
                        <Tab.Pane eventKey={cat.key} key={cat.key}>
                            <Row>
                                {!isListLoaded ? (
                                <Spinner animation='grow' variant='light' style={{ margin: '40vh auto auto auto'}} />
                                ) : isEmptyList ? (
                                <span className='emptyListMessage'>Start by adding some games</span>
                                ) : gameList.props.children.length === 0 ? (
                                <span className='emptyListMessage'>No games to show in this category</span>
                                ) : (
                                gameList
                                )}
                            </Row>
                        </Tab.Pane>
                        );
                    })}
                    </Tab.Content>
                </div>
            </Tab.Container>
            <EditForm show ={showModal} handleCloseModal = {handleCloseModal} gameData = {gameData} updateItemHandler = {handleEditItem}/>
            <BottomSheet 
                open={bottomSheetOpen} 
                onDismiss={handleCloseGameInfo} 
                defaultSnap={({ snapPoints }) =>
                    Math.min(...snapPoints)
                }
                snapPoints={({ minHeight}) => [
                    minHeight * 1.1
                ]}
                header = {gameData && gameData.id ? (
                    <Row className='bottomSheetHeaderRow'>
                        <Col xs='4' className="gameImageWrapper">
                            <img className='bottomSheetImage' src={IMAGES_SERVER_URL.T_720P + gameData.imageId + '.jpg'} alt=''/>
                        </Col>
                        <Col xs='8'>
                            <Row className='bottomSheetGameTitle'>
                                {gameData.title}
                            </Row>
                            <Row>
                        
                                <span className='bottomSheetDataSecondary'>{getCleanPlatformName(gameData.platform.name)} </span>
                            </Row>
                            <Row>
                                <div style={{width: '70%', display: 'flex', justifyContent: 'spaceBetween'}}>
                                    <span className='bottomSheetDataSecondary'>Played in {gameData.playdate}</span>
                                    <span className='bottomSheetDataSecondary' style={{margin: '0.25rem 0', borderRight: "2px solid var(--darkAccent)"}}></span>
                                    <span className='bottomSheetDataSecondary'> {gameData.playtime} h </span>
                                </div>
                            </Row>
                            <Row>
                            <span className='bottomSheetDataSecondary' >
                                <Rating 
                                    readonly={true} 
                                    size={20} 
                                    allowFraction
                                    initialValue={gameData.rating.reduce((a, b) => a + b, 0) / gameData.rating.length} 
                                    fillColor ={(gameData.rating.reduce((a, b) => a + b, 0) / gameData.rating.length) === 5 ? '#FFBC0D' : '#fff'} 
                                    emptyColor={'#121318'}/>
                            </span>
                            </Row>
                        </Col>
                    </Row>
                ) : <></>}
            >
                {gameData && gameData.id ? (
                <>
                <button disabled style={{opacity: "0.3"}} className="bottomSheetOption" onClick={(e) => { }} title="Move entry" ><FaSort /> Reorder</button>
                <button className="bottomSheetOption" onClick={(e) => { handleShowEditModal(gameData.id) }} title="Edit entry"><AiOutlineEdit /> Edit info</button>
                <button className="bottomSheetOption" onClick={(e) => { handleRemoveItem(gameData.id) }} title="Delete entry" ><MdClose /> Remove from list</button>
                <button disabled style={{opacity: "0.3"}} className="bottomSheetOption" onClick={(e) => { }} title="Game Info" ><FiInfo /> Game Info</button>
                </> )
                : (
                    <Spinner animation="border" variant="light" className="my-3 mx-auto d-block" />
                )}
            </BottomSheet>
        </>
    )
}

export default ListMobile
