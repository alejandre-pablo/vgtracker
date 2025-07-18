import { useState, React, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchedGame from '../components/SearchedGame';
import AddForm from '../components/forms/AddForm';
import { Row, Spinner } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import EditForm from '../components/forms/EditForm';
import { SEARCH_FUNCTIONS_URL } from '../constants/urls';

const SearchResultsContainer = ({list, handleEditItem}) => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    const [searchParams, setSearchParams] = useSearchParams();

    const [currQuery, setCurrQuery] = useState('');
    
    const [gameData, setGameData] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [searchResults, setSearchResults] = useState({
        count: null,
        results: [],
    });

    const handleAddGame = (id) => {
        setGameData(searchResults.results.find(game => game.id === id));
        setShowAddModal(true);
    }

    const handleEditGame = (id) => {
        setGameData(searchResults.results.find(game => game.id === id));
        setShowEditModal(true);
    }
    const handleCloseAddModal = () => {
        setShowAddModal(false);
    } 

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    } 

    const listEmpty =
        <div className='emptySearchList'> 
            <div> No games, big sad :(</div>
            <img src= {window.location.origin + '/img/le-sad.gif'} alt='sad' className='emptyListImage'></img>
        </div>

    const listResults =
    isTabletOrMobile ? (
        <ul className='searchList'>
            { searchResults.count === null ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}} />
            : searchResults.count === 0 ? listEmpty
            : searchResults.results.map((result) => 
                <SearchedGame key={result.id} gameItem={result} addGameHandler={handleAddGame} editGameHandler={handleEditGame}/>
            )}
        </ul>
    ) : (
        <ul className='searchList'>
            { searchResults.count === null ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}} />
            : searchResults.count === 0 ? listEmpty
            : searchResults.results.map((result, index) => 
                <div key={result.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SearchedGame key={result.id} gameItem={result} addGameHandler={handleAddGame} editGameHandler={handleEditGame}/>
                </div>
            )}
        </ul>
    )

    async function gameSearch(searchQuery, newSearch = false) {
        try {
            const res = await fetch(SEARCH_FUNCTIONS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchQuery: searchQuery }),
            });
    
            const data = await res.json();
            const results = data.map(game => ({
                id: game.id,
                name: game.name,
                imageId: game.cover ? game.cover.image_id : '',
                platforms: game.platforms || [],
                developer: game.involved_companies?.filter(c => c.developer).map(c => c.company),
                publisher: game.involved_companies?.filter(c => c.publisher).map(c => c.company),
                genres: game.genres || [],
                rating: game.total_rating || 0
            }));
            setSearchResults({
                count: results.length,
                results,
            });
            setCurrQuery(searchQuery);
        } catch (err) {
            console.error('Error fetching IGDB data:', err);
        }
    }

    useEffect(() => {
        let searchQuery = searchParams.get('search_query')
        if(currQuery !== searchQuery) {
            gameSearch(searchQuery, false, true);
        }
    }, [searchParams])

    return (
        <>
            <Row className='resultsContainer'>
                {searchResults.count === null ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                    : searchResults.length === 0 ? listEmpty
                    : listResults
                }
            </Row>
            <AddForm show ={showAddModal} handleCloseModal = {handleCloseAddModal} gameData = {gameData}/>
            <EditForm show={showEditModal} handleCloseModal = {handleCloseEditModal} gameData = {gameData} updateItemHandler = {handleEditItem}/>
        </>
        
    )
}

export default SearchResultsContainer