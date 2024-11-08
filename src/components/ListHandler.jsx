import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useAuth, useFirebaseApp, useFirestore, useFirestoreDocData } from 'reactfire';

const ListHandler = ({children}) => {

    const location = useLocation();
    const firebaseApp = useFirebaseApp();
    const auth = useAuth(firebaseApp);
    const firestore = useFirestore();
    const userDataRef = doc(firestore, 'lists', auth.currentUser.uid);

    const {status, data } = useFirestoreDocData(userDataRef);

    const [list, setList] = useState([]);

    const [isEmptyList, setIsEmptyList] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        if(location.state !== null && status === 'success') {
            let addedGame = location.state.addedGame;
            window.history.replaceState({}, document.title)
            handleAddItem(addedGame);
        }
    }, [location.state])

    useEffect(() => {
        // Update list and session storage when Firestore data changes
        if (status === 'success') {
            if (!data || !data.games) {
                setIsEmptyList(true);
                setList([]);
                sessionStorage.setItem('games', JSON.stringify([]));
            } else {
                const gamesList = JSON.parse(data.games);
                setList(gamesList);
                setIsEmptyList(gamesList.length === 0);
                sessionStorage.setItem('games', data.games);
            }
            setIsLoaded(true);
        }
    }, [status, data]);


    const safeWrite = newList => {
        sessionStorage.setItem('games', JSON.stringify(newList));
        setDoc(userDataRef, {games: JSON.stringify(newList)});
    }

    function fetchList() {
        if (sessionStorage.getItem('games') !== '') {
            return JSON.parse(sessionStorage.getItem('games'));
        }
        return null;
    }

    const handleAddItem = game => {
        var tmpList = fetchList();
        safeWrite([...tmpList, game]);
    }

    const handleEditItem = game => {
        var tmpList = fetchList();
        var gameIndex = tmpList.findIndex((item => item.id === game.id))
        if(tmpList[gameIndex].playstatus !== game.playstatus) {
            tmpList.splice(gameIndex, 1)
            tmpList.push(game)
        } else {
            tmpList[gameIndex] = game;
        }
        safeWrite(tmpList);
    }

    const handleRemoveItem = gameId => {
        var tmpList = fetchList().filter((item => item.id !== gameId))
        safeWrite(tmpList);
    }

    const handleOrderList = newList => {
        safeWrite(newList);
    }

    return (
        <>{children(list, isEmptyList, isLoaded, handleEditItem, handleRemoveItem, handleOrderList)}</>
    )
}

export default ListHandler