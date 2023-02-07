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
        if(searchString !== '') {

            navigate({
                pathname: "/search",
                search: createSearchParams({
                    search_query: normalizedString
                }).toString()
            });
        }
    }
    return (
        <div style={{width: '100%'}}>
            <form style={{width: '100%'}} onSubmit={onSubmit}>
                <input style={{width: '100%'}} type= 'text' className='searchBar' value={searchString} onChange={handleChange} placeholder={"Search"}/>
                <span className='buttonContainer'>
                    <button type='submit' className='searchBarButton'> <FaSearch/></button> 
                </span>
                
            </form>
        </div>
    )
}

export default Search