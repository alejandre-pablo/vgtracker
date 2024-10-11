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
    const [sortingCache, setSortingCache] = useState(['order', 'default'])
    
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
        handleSorting(sortingCache);
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

    const handleSorting = sorting => {
        var tmpList = fetchList();
        if(sorting[0] !== 'order') {
            tmpList.sort(sortByProperty(sorting[0], sorting[1]));
        }
        setList(tmpList);
        setSortingCache(sorting);
    }

    const handleOrderList = newList => {
        safeWrite(newList);
    }

    function sortByProperty(property, way) {
        var sortOrder = 1;
        if(way === "desc") {
            sortOrder = -1;
        }
        
        switch (property) {
            case 'title':
            case 'platform':
                return function (a,b) {
                    return (a[property].localeCompare(b[property])) * sortOrder;
                }
            case 'playtime':
                return function (a,b) {
                    var normalizedA = parseFloat(a[property].replace(',', '.').replace(':', '.'))
                    var normalizedB = parseFloat(b[property].replace(',', '.').replace(':', '.'))
                    var result = (normalizedA < normalizedB) ? -1 : (normalizedA > normalizedB) ? 1 : 0;
                    if(result === 0 && (a[property] !== '' && b[property] !== '')) {
                        return 1 * sortOrder;
                    }
                    return result * sortOrder;
                }
            case 'rating':
                return function (a,b) {
                    var normalizedA = parseFloat(a[property].reduce((partialSum, a) => partialSum + a, 0));
                    var normalizedB = parseFloat(b[property].reduce((partialSum, a) => partialSum + a, 0));
                    var result = (normalizedA < normalizedB) ? -1 : (normalizedA > normalizedB) ? 1 : 0;
                    if(result === 0 && (a[property] !== '' && b[property] !== '')) {
                        return 1 * sortOrder;
                    }
                    return result * sortOrder;
                }
            default:
                return function (a,b) {
                    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    if(result === 0 && (a[property] !== '' && b[property] !== '')) {
                        return 1 * sortOrder;
                    }
                    return result * sortOrder;
                }
        }
        
    }

    return (
        <>{children(list, isEmptyList, isLoaded, handleEditItem, handleRemoveItem, handleSorting, handleOrderList)}</>
    )
}

export default ListHandler