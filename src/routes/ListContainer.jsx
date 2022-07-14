import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import { Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useAuth, useFirebaseApp, useFirestore, useFirestoreDocData } from 'reactfire';

import List from '../components/List'

const ListContainer = () => {

    const location = useLocation();

    const firebaseApp = useFirebaseApp();
    const auth = useAuth(firebaseApp);
    const firestore = useFirestore();
    const userDataRef = doc(firestore, 'lists', auth.currentUser.uid);

    const {status, data} = useFirestoreDocData(userDataRef);

    const [list, setList] = useState(() => {
        return (status === 'success' && data !== undefined) ? JSON.parse(data.games) : []
    });

    useEffect(() => {
        if(location.state !== null && status === 'success') {
            setDoc(userDataRef, {games: JSON.stringify(list)});
            let addedGame = location.state.addedGame
            window.history.replaceState({}, document.title)
            handleAddItem(addedGame);
        }
    }, [location.state])

    useEffect(() => {
        if(status === 'success' && data !== undefined) {
                setList(JSON.parse(data.games));
                localStorage.setItem('games', data.games)
        }
    },[status, data])

    const safeWrite = list => {
        setDoc(userDataRef, {games: JSON.stringify(list)})
    }

    const handleAddItem = addedGame => {
        location.state = null
        safeWrite([...list, addedGame]);
    }

    const handleEditRemoveItem = newList => {
        safeWrite(newList);
    }
    return (
        <Row className='mainContainer'>
            <List list = {list} handleEditRemoveItem = {handleEditRemoveItem} />
        </ Row>
    )
}

export default ListContainer
