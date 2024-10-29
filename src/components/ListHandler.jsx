import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useAuth, useFirebaseApp, useFirestore, useFirestoreDocDataOnce } from 'reactfire';

const ListHandler = ({children}) => {

    const location = useLocation();
    const firebaseApp = useFirebaseApp();
    const auth = useAuth(firebaseApp);
    const firestore = useFirestore();
    const userDataRef = doc(firestore, 'lists', auth.currentUser.uid);

    const {status, data } = useFirestoreDocDataOnce(userDataRef);

    const [list, setList] = useState([]);

    const [isEmptyList, setIsEmptyList] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const [prevStatus, setPrevStatus] = useState('none');
    
    useEffect(() => {
        if(location.state !== null && status === 'success') {
            let addedGame = location.state.addedGame;
            window.history.replaceState({}, document.title)
            handleAddItem(addedGame);
        }
    }, [location.state])

    useEffect(() => {
        //Caso primer render, se invoca a useFirestoreDocDataOnce y se espera
        if(prevStatus === 'loading' && status === 'success' ) {
            if(!data){
                setIsEmptyList(true);
                setIsLoaded(true);
                sessionStorage.setItem('games',[]);
            } 
            // Si hay datos en DB, se carga la sesion y la lista con los datos
            else {
                setIsEmptyList(false);
                setIsLoaded(true);
                setList(JSON.parse(data.games));
                sessionStorage.setItem('games', data.games);
            }
            
        }
        //Caso recarga de lista (atras, o vuelta de una busqueda)
        if(prevStatus === 'none' && status === 'success') {
            //Cargar desde sesion
            if(sessionStorage.getItem('games')) {
                setList(JSON.parse(sessionStorage.getItem('games')));
                setIsEmptyList(false);
                setIsLoaded(true);
            } 
        }
        setPrevStatus(status);
    },[status])


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