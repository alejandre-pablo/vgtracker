import React, {useEffect, useState} from 'react'

import List from '../components/List'

const StatsContainer = () => {
    const [list, setList] = useState(() => {
        const list = JSON.parse(localStorage.getItem('games'));
        return (list ? list : [])
    });

    useEffect(() => {
        localStorage.setItem(('games'), (JSON.stringify(list)))
    }, [list])

    const handleAddItem = addItem => {
        setList([...list, addItem]);
    }
    return (
        <>
            <div>STAAAAAAAAAAAAAAAAAAATS</div>
            <List list = {list} setList = {setList}/>
        </>
    )
}

export default StatsContainer
