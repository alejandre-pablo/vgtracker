import React, { useState } from 'react'
import { Tab, Col, Row, Spinner, Dropdown, Nav } from 'react-bootstrap';
import { AiFillCaretDown, AiFillCaretUp, AiOutlineEdit } from 'react-icons/ai'
import { TbCalendarUp, TbCalendarDown, TbClockUp, TbClockDown, TbSettingsBolt } from 'react-icons/tb'
import { FaArrowDown, FaArrowUp, FaRegClock, FaSort, FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown, FaStar, } from 'react-icons/fa';
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
import useScrollVisibility from '../hooks/useScrollVisibility';
import BottomNavWheel from './BottomNavWheel';


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

    const visible = useScrollVisibility();

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

    const sortKeys = [
        { key: "title", label: "Title" },
        { key: "platform", label: "Platform" },
        { key: "playtime", label: "Playtime" },
        { key: "playdate", label: "Playdate" },
        { key: "rating", label: "Rating" },
    ];

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
                <div className={`bottomMenuMobile ${visible ? "visible" : "hidden"}`}>
                    <BottomNavWheel
                        categories={listCategoriesWithCounts}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>
            </Tab.Container>
            <Dropdown drop='up' className={`floatingMobileSort ${visible ? "visible" : "hidden"}`}>
                <Dropdown.Toggle className="faIconButton">
                    {sortIcons[`${sortingCache[0]}-${sortingCache[1]}`] || <FaSortAlphaDown />}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {sortKeys.map(({ key, label }) => (
                    <Dropdown.Item key={key} onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleSort(key)}} className='floatingMobileSortItem'>
                        {label}
                        {sortingCache[0] === key && (sortingCache[1] === "asc" ? (
                            <FaArrowUp />
                        ) : (
                            <FaArrowDown />
                        ))}
                    </Dropdown.Item>
                    ))}

                    <Dropdown.Item onClick={() => setSortingCache(['order', 'default'])}>
                        Default
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
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
