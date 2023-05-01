import React, {useState} from 'react'
import {createSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'
import { Button, Form, FormControl } from 'react-bootstrap';

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
        <Form className="d-flex searchBar" onSubmit={onSubmit}>
            <div className="input-group">
                <FormControl
                    type='search'
                    placeholder='Search'
                    className='searchBarField'
                    aria-label="Search"
                    value={searchString}
                    onChange={handleChange}
                />
                <Button type='submit' className='searchBarButton'> <FaSearch/></Button> 
            </div>
            
        </Form>
    )
}

export default Search