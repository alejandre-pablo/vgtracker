import { useState, React, useEffect } from 'react'
import {useSearchParams } from 'react-router-dom'
import SearchedGame from '../components/SearchedGame';
import AddForm from '../components/forms/AddForm';
import { Row } from 'react-bootstrap';

const SearchResultsContainer = (props) => {

    const k = 'd068d12dda5d4c8283eaa6167fe26f79';

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const [currQuery, setCurrQuery] = useState('');
    
    const [gameId, setGameId] = useState(-1);
    const [showModal, setShowModal] = useState(false);

    const [searchResults, setSearchResults] = useState({
        count: 0,
        next: null,
        previous: null,
        results: [],
        user_platforms: false
    });

    const handleAddGame = (id) => {
        setGameId(id);
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    } 
    
    const handleScroll = (e) => {
        if(searchResults.next !== null && !isLoading) {
            if(e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight) {
                setIsLoading(true);
                gameSearch(currQuery, true);
                setIsLoading(false);
            }
        }
    }

    const listResults = 
        <ul onScroll={handleScroll} className='searchList'>
            {searchResults.results.map((result, index) => 
                <div className={index % 2 === 0 ? 'highlight' : ''}>
                    <SearchedGame  key={result.id} gameItem ={result} addGameHandler = {handleAddGame}/>
                </div>
            )}
        </ul>

    const listEmpty =
        <div className='emptySearchList'> 
            <div> No games,  big sad :(</div>
            <img src= {window.location.origin + '/img/le-sad.gif'} alt='sad' className='emptyListImage'></img>
        </div>

    function gameSearch (searchQuery, nextPage=false, newSearch=false) {
        let url = '';
        if(nextPage) {
            url = searchResults.next
        } else {
            url = `https://api.rawg.io/api/games?search=${searchQuery}&key=${k}&search_precise=true&page=1`
        }
        fetch(url).then( res => res.json()).then((resData) => {
            if(newSearch) {
                setSearchResults({
                    count: resData.count,
                    previous: resData.previous,
                    next: resData.next,
                    results: resData.results,
                    user_platforms: resData.user_platforms
                })
            }
             else {
                setSearchResults({
                    count: resData.count,
                    previous: resData.previous,
                    next: resData.next,
                    results: searchResults.results.concat(resData.results),
                    user_platforms: resData.user_platforms
                })
            }
            setCurrQuery(searchQuery);
        });
    }

    useEffect(() => {
        let searchQuery = searchParams.get('search_query')
        if(currQuery !== searchQuery) {
            gameSearch(searchQuery, false, true);
        }
    }, [searchParams])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, [])

    /* var pagesButtons = Array.from(Array(Math.floor(searchResults.count / 20)), (e, i) => {return <button name={i + 1} onClick={handlePageNav}>{i + 1}</button>}).slice(0, 20)

    const pagesNav = <div className='pagesNavWrapper'>            
            {searchResults.previous !== null ? <button style={{paddingRight: '1rem'}} name='previous'> &lt; Previous </button> : <></>}
            {pagesButtons}
            {searchResults.next !== null ? <button style={{paddingLeft: '1rem'}} name='next'>  Next &gt; </button> : <></>}    
    </div> */

        
    return (
        <>
            <Row className='resultsContainer'>
                    <h4 style= {{color: 'var(--accent)', padding: '0.5rem', paddingLeft: '2rem'}}> 
                        Showing search results for:
                        <span style={{fontStyle:'italic'}}>
                            &nbsp;"{searchParams.get('search_query')}"
                        </span>
                    </h4>
                    {searchResults.count !== 0 ? listResults : listEmpty}
            </Row>
            {/* {pagesNav} */}
            <AddForm show ={showModal} handleCloseModal = {handleCloseModal} gameId = {gameId}/>
        </>
        
    )
}

export default SearchResultsContainer