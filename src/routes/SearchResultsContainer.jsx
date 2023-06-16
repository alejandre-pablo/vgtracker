import { useState, React, useEffect, useRef } from 'react'
import {useSearchParams } from 'react-router-dom'
import SearchedGame from '../components/SearchedGame';
import AddForm from '../components/forms/AddForm';
import { Row, Spinner } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const SearchResultsContainer = (props) => {

    const k = 'd068d12dda5d4c8283eaa6167fe26f79';
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    const listInnerRef = useRef();

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const [currQuery, setCurrQuery] = useState('');
    
    const [gameId, setGameId] = useState(-1);
    const [showModal, setShowModal] = useState(false);

    const [searchResults, setSearchResults] = useState({
        count: null,
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
            if (listInnerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
                if (scrollTop + clientHeight >= (scrollHeight-99)) {
                    setIsLoading(true);
                    gameSearch(currQuery, true);
                    setIsLoading(false);
                }
              }
        }
    }

    const listEmpty =
        <div className='emptySearchList'> 
            <div> No games, big sad :(</div>
            <img src= {window.location.origin + '/img/le-sad.gif'} alt='sad' className='emptyListImage'></img>
        </div>

    const listResults =
        isTabletOrMobile ?
        <ul onScroll={handleScroll} ref={listInnerRef} className='searchListMobile' >
            { searchResults.count === null ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}} />
            : searchResults.count === 0 ? listEmpty
            : searchResults.results.map((result) => 
                <SearchedGame key={result.id} gameItem ={result} addGameHandler = {handleAddGame}/>
            )}
        </ul>
        :<ul onScroll={handleScroll} ref={listInnerRef} className='searchListMobile'>
            { searchResults.count === null ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}} />
            : searchResults.count === 0 ? listEmpty
            : searchResults.results.map((result, index) => 
            <div className={index % 2 === 0 ? 'highlight' : ''}>
                <SearchedGame  key={result.id} gameItem ={result} addGameHandler = {handleAddGame}/>
            </div>
            )}
        </ul> 

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
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <>
            <Row className='resultsContainer'>
                {searchResults.count === null ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                    : searchResults.length === 0 ? listEmpty
                    : listResults
                }
            </Row>
            <AddForm show ={showModal} handleCloseModal = {handleCloseModal} gameId = {gameId}/>
        </>
        
    )
}

export default SearchResultsContainer