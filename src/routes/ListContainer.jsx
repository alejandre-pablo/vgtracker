import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';

import List from '../components/List'

const ListContainer = () => {

    const location = useLocation();

    const [list, setList] = useState(() => {
        const list = JSON.parse(localStorage.getItem('games'));
        return (list ? list : [])
    });

    useEffect(() => {
        if(location.state !== null) {
            localStorage.setItem(('games'), (JSON.stringify(list)))
            let addedGame = location.state.addedGame
            window.history.replaceState({}, document.title)
            handleAddItem(addedGame);
        }
    }, [location.state])

    useEffect(() => {
        localStorage.setItem(('games'), (JSON.stringify(list)))
    }, [list])


    const handleAddItem = addedGame => {
        
        location.state = null
        setList([...list, addedGame]);
    }
    return (
        <>
            <List list = {list} setList = {setList} />
        </>
    )
}

export default ListContainer
