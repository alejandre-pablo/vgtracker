import React from 'react'
import {createSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'
import { Button, Form } from 'react-bootstrap';
import { useSearch } from './contexts/SearchContext';

const Search = () => {

    const {searchString, setSearchString} = useSearch();
    
    const navigate = useNavigate();

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
        setSearchString('');
    }
    return (
        <Form className="d-flex searchBar" onSubmit={onSubmit}>
            <div className="input-group">
                <Form.Control
                    type='text'
                    placeholder='Search'
                    className='searchBarField'
                    aria-label="Search"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                />
                <Button type='submit' className='searchBarButton'> <FaSearch/></Button> 
            </div>
            
        </Form>
    )
}

export default Search