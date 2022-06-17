import { useState, React } from 'react'
import { useLocation } from 'react-router-dom'
import SearchedGame from '../components/SearchedGame';
import AddForm from '../components/forms/AddForm';

const SearchResultsContainer = (props) => {

    const location = useLocation();
    
    const [gameId, setGameId] = useState(-1);
    const [showModal, setShowModal] = useState(false);
    const handleAddGame = (id) => {
        setGameId(id);
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }

    const listResults =
        <ul className='searchList'>
                {location.state.searchResults.map((result) => <SearchedGame key={result.id} gameItem ={result} addGameHandler = {handleAddGame}/>)}
        </ul>

    const listEmpty =
        <div className='emptySearchList'> 
            <div> No jogos big sad :(</div>
            <img src= {window.location.origin + '/img/le-sad.gif'} alt='sad' className='emptyListImage'></img>
        </div>
        
    return (
        <>
            <div className='searchTitle'>Search results for "{location.state.searchString}":</div>
            {location.state.searchResults.length !== 0 ?listResults : listEmpty}
            <AddForm show ={showModal} handleCloseModal = {handleCloseModal} gameId = {gameId}/>
        </>
        
    )
}

export default SearchResultsContainer