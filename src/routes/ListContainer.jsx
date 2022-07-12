import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';
import { FirebaseAppProvider, useAuth, useFirebaseApp, useFirestore, useFirestoreDoc, useFirestoreDocData, useUser } from 'reactfire';

import List from '../components/List'

const ListContainer = () => {

    const location = useLocation();

    const firebaseApp = useFirebaseApp();
    const auth = useAuth(firebaseApp);
    const firestore = useFirestore();
    const userDataRef = doc(firestore, 'lists', auth.currentUser.uid);
    const collectionRef = collection(firestore, 'lists');

    const {status, data} = useFirestoreDocData(userDataRef);

    /* const [list, setList] = useState(() => {
        const list = getDoc(userDataRef);
        debugger
        return (list ? list : [])
    });
 */
    const [list, setList] = useState([]);

    useEffect(() => {
        if(location.state !== null && status === 'success') {
            /* localStorage.setItem(('games'), (JSON.stringify(list))) */
            setDoc(userDataRef, {games: JSON.stringify(list)});
            let addedGame = location.state.addedGame
            window.history.replaceState({}, document.title)
            handleAddItem(addedGame);
        }
    }, [location.state])

    useEffect(() => {
        if(status === 'success') {
            setList(JSON.parse(data.games));
            localStorage.setItem('games', data.games)
        }
    },[data])

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
        <>
            <List list = {list} handleEditRemoveItem = {handleEditRemoveItem} />
        </>
    )
}

export default ListContainer
