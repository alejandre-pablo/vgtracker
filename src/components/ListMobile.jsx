import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSearch } from './contexts/SearchContext';
import { Tab, Col, Row, Spinner, Dropdown } from 'react-bootstrap';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import { TbCalendarUp, TbCalendarDown, TbClockUp, TbClockDown } from 'react-icons/tb'
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown, FaStar, FaUndo } from 'react-icons/fa';
import EditForm from './forms/EditForm';
import SortableGame from './SortableGame';
import { arrayMove } from '@dnd-kit/sortable';
import Game from './Game';
import GameMobile from './GameMobile';


const ListMobile = (props) => {
    const {list, isEmptyList, isListLoaded, handleEditItem, handleRemoveItem, handleOrderList} = props;

    const [mutableList, setMutableList] = useState(list);
    const [activeTab, setActiveTab] = useState("Finished");

    const {searchString} = useSearch();
    const [isFilteredSearch, setIsFilteredSearch] = useState(false);

    const [sortingCache, setSortingCache] = useState(['order', 'default'])
    const [isSorted, setIsSorted] = useState(false);

    const [gameData, setGameData] = useState({});
    const [showModal, setShowModal] = useState(false);

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

    useEffect(() => {
        const updatedList = getFilteredSortedList();
        setMutableList(updatedList);
    }, [list, searchString, sortingCache, activeTab]);

    function getFilteredSortedList() {
        let updatedList = [...list];
      
        const activeCategory = listCategories.find(cat => cat.key === activeTab);
        if (activeCategory) {
            updatedList = updatedList.filter(activeCategory.filter);
        }
      
        const hasSearch = searchString.trim() !== "";
        if (hasSearch) {
            updatedList = filterBySearchString(updatedList);
            setIsFilteredSearch(true);
        } else {
            setIsFilteredSearch(false);
        }
      
        if (sortingCache[1] !== 'default') {
            updatedList.sort(sortByProperty(sortingCache[0], sortingCache[1]));
        }
      
        return updatedList;
    }

    function filterBySearchString(list) {
        const normalizedSearch = searchString.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return list.filter(game =>
            game.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch)
        );
    }

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

    function sortByProperty(property, way) {
        var sortOrder = 1;
        if(way === "desc") {
            sortOrder = -1;
        }
        switch (property) {
            case 'title':
                return function (a,b) {
                    return (a[property].localeCompare(b[property])) * sortOrder;
                }
            case 'platform':
                return function (a,b) {
                    return (a[property].name.localeCompare(b[property].name)) * sortOrder;
                }
            case 'playtime':
                return function (a,b) {
                    var normalizedA = parseFloat(a[property].replace(',', '.').replace(':', '.'))
                    var normalizedB = parseFloat(b[property].replace(',', '.').replace(':', '.'))
                    var result = (normalizedA < normalizedB) ? -1 : (normalizedA > normalizedB) ? 1 : 0;
                    if(result === 0 && (a[property] !== '' && b[property] !== '')) {
                        return 1 * sortOrder;
                    }
                    return result * sortOrder;
                }
            case 'rating':
                return function (a,b) {
                    var normalizedA = parseFloat(a[property].reduce((partialSum, a) => partialSum + a, 0));
                    var normalizedB = parseFloat(b[property].reduce((partialSum, a) => partialSum + a, 0));
                    var result = (normalizedA < normalizedB) ? -1 : (normalizedA > normalizedB) ? 1 : 0;
                    if(result === 0 && (a[property] !== '' && b[property] !== '')) {
                        return 1 * sortOrder;
                    }
                    return result * sortOrder;
                }
            default:
                return function (a,b) {
                    return 1;
                }
        }
    }

    function handleChangeIndex(id, newIndex) {
        const targetIndexMutated = newIndex - 1;
        //Filter logic beforehand so that waiting for the rerender doesn't cause UI lag
        const oldIndexMutated = list.findIndex(item => item.id === id);
        const correctedNewIndexMutated = list.findIndex(item => item.id ===  mutableList[targetIndexMutated].id);
        setMutableList(arrayMove(mutableList, oldIndexMutated, correctedNewIndexMutated));

        const oldIndex = list.findIndex(item => item.id === id);
        const correctedNewIndex = list.findIndex(item => item.id ===  mutableList[targetIndexMutated].id);
        const newList = arrayMove(list, oldIndex, correctedNewIndex);
        handleOrderList(newList);
    }

    function handleShowEditModal(id) {
        setGameData(list.find(game => game.id === id));
        setShowModal(true);
    }
    function handleCloseModal() {
        setShowModal(false);
    }

    const listHeader = 
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
    </Row>

    const listCategories = [
        { key: "All", label: "ALL GAMES", filter: () => true, header: listHeader },
        { key: "Finished", label: "COMPLETED", filter: game => game.playstatus === "finished", header: listHeader },
        { key: "Playing", label: "PLAYING", filter: game => game.playstatus === "playing", header: listHeader },
        { key: "OnHold", label: "ON HOLD", filter: game => game.playstatus === "onhold", header: listHeader },
        { key: "Dropped", label: "DROPPED", filter: game => game.playstatus === "dropped", header: listHeader },
        { key: "Other", label: "OTHER", filter: game => game.playstatus === "other", header: listHeader },
        { key: "PlanToPlay", label: "PLAN TO PLAY", filter: game => game.playstatus === "plantoplay", header: listHeaderPlanToPlay },
    ];

    const listCategoriesWithCounts = listCategories.map(cat => {
        let filteredList = list.filter(cat.filter);
        filteredList = filterBySearchString(filteredList);
        const count = filteredList.length
        return {
            ...cat,
            label: isFilteredSearch ? `${cat.label} (${count})` : cat.label
        };
    });

    const generateGameList = (games) => (
        <ul>
            {games.map((game, index) => (
                <li key={game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <GameMobile
                        game={game}
                        style="list"
                        onClickRemoveItem={handleRemoveItem}
                        onClickEditItem={handleShowEditModal}
                    />
            </li>
            ))}
        </ul>
      );

    return (
        <>
        <EditForm show ={showModal} handleCloseModal = {handleCloseModal} gameData = {gameData} updateItemHandler = {handleEditItem}/>
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
                           {/*  {cat.header} */}
                            <Row>
                                {!isListLoaded ? (
                                <Spinner animation='grow' variant='light' style={{ marginTop: '50%', margin: 'auto' }} />
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
        </>
    )
}

export default ListMobile
