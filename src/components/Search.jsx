import React from 'react'
import {createSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa'
import { Button, Form, InputGroup } from 'react-bootstrap';
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
            <InputGroup style={{ flexWrap: 'nowrap' }}>
                <Form.Control
                    type='text'
                    placeholder='Search'
                    aria-label="Search"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                />
                {searchString && (
                    <Button className='inputClearButton' onClick={() => setSearchString('')}>
                        <FaTimes />
                    </Button>
                )}
                <Button type='submit' className='faIconButton' style={{height: '100%', display: 'flex', alignItems: 'center', margin: '0'}}> <FaSearch/></Button> 
            </InputGroup>
        </Form>
    )
}

export default Search