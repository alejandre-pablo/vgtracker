import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import { Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { preloadFirestoreDoc, useAuth, useFirebaseApp, useFirestore, useFirestoreDocDataOnce } from 'reactfire';

import List from '../components/List'

const ListContainer = () => {

    const location = useLocation();
    const firebaseApp = useFirebaseApp();
    const auth = useAuth(firebaseApp);
    const firestore = useFirestore();
    const userDataRef = doc(firestore, 'lists', auth.currentUser.uid);

    const {status, data } = useFirestoreDocDataOnce(userDataRef);

    const [list, setList] = useState([]);

    const [prevStatus, setPrevStatus] = useState('none')

    useEffect(() => {
        if(location.state !== null && status === 'success') {
            let addedGame = location.state.addedGame
            window.history.replaceState({}, document.title)
            handleAddItem(addedGame);
        }
    }, [location.state])

    useEffect(() => {
        if(prevStatus === 'loading' && status === 'success' && data !== undefined) {
                console.log('Fetched remote list');
                setList(JSON.parse(data.games));
                sessionStorage.setItem('games', data.games)
        }
        if(prevStatus === 'none' && status === 'success') {
            console.log('Fetched local list');
            setList(JSON.parse(sessionStorage.getItem('games')));
        }
        setPrevStatus(status);
    },[status])

    const safeWrite = newList => {
        console.log('List obj updated');
        setList(newList);
        sessionStorage.setItem('games', JSON.stringify(newList))
        setDoc(userDataRef, {games: JSON.stringify(newList)})
    }

    const handleAddItem = addedGame => {
        location.state = null
        const tmpList = JSON.parse(sessionStorage.getItem('games'));
        safeWrite([...tmpList, addedGame]);
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
