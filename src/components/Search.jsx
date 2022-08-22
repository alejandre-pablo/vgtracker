import React, {useState} from 'react'
import {createSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'

const Search = () => {

    const [searchString, setSearchString] = useState('');
    
    const navigate = useNavigate();
    const handleChange = (e) => {
        setSearchString(e.target.value);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        let normalizedString = searchString.toLowerCase();
        searchString === '' ? alert('Enter a valid title')
        : navigate({
            pathname: "/search",
            search: createSearchParams({
                search_query: normalizedString
            }).toString()
        });
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type= 'text' className='searchBar' value={searchString} onChange={handleChange} placeholder={"Search"}/>
                <span className='buttonContainer'>
                    <button type='submit' className='searchBarButton'> <FaSearch/></button> 
                </span>
                
            </form>
        </div>
    )
}

export default Search