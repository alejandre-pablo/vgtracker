import React, {useState} from 'react'
import {useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'
import { Spinner } from 'react-bootstrap';

const Search = () => {

    const [searchString, setSearchString] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    let k = 'd068d12dda5d4c8283eaa6167fe26f79'

    const navigate = useNavigate();
    const handleChange = (e) => {
        setSearchString(e.target.value);
    }
    const onSubmit = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let normalizedString = searchString.split(' ').join('-').toLowerCase();
        searchString === '' ? alert('Enter a valid title')
        :fetch(`https://api.rawg.io/api/games?search=${normalizedString}&key=${k}&search_exact=true&ordering=-rating`).then( res => res.json()).then((results) => {
            navigate(`/search/${normalizedString}`, {state: {searchResults: results.results, searchString: searchString}});
            setIsLoading(false);
            setSearchString('');
        });
        
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type= 'text' className='searchBar' value={searchString} onChange={handleChange} />
                <span className='buttonContainer'>
                    {isLoading 
                        ? <Spinner as="span" className='searchBarLoading' animation="border" size="sm" role="status" aria-hidden="true"/> 
                        : <button type='submit' className='searchBarButton'> <FaSearch/></button> 
                    }
                </span>
                
            </form>
        </div>
    )
}

export default Search