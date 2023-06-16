import { doc, setDoc } from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import { Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useLocation} from 'react-router-dom';
import { useAuth, useFirebaseApp, useFirestore, useFirestoreDocDataOnce } from 'reactfire';

import List from '../components/List'
import ListMobile from '../components/ListMobile';

const ListContainer = () => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})


    const location = useLocation();
    const firebaseApp = useFirebaseApp();
    const auth = useAuth(firebaseApp);
    const firestore = useFirestore();
    const userDataRef = doc(firestore, 'lists', auth.currentUser.uid);

    const {status, data } = useFirestoreDocDataOnce(userDataRef);

    const [list, setList] = useState([]);

    const [isEmptyList, setIsEmptyList] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const [prevStatus, setPrevStatus] = useState('none')

    useEffect(() => {
        if(location.state !== null && status === 'success') {
            let addedGame = location.state.addedGame
            window.history.replaceState({}, document.title)
            handleAddItem(addedGame);
        }
    }, [location.state])

    useEffect(() => {
        //Caso primer render, se invoca a useFirestoreDocDataOnce y se espera
        if(prevStatus === 'loading' && status === 'success' ) {
            if(!data){
                console.log('Recuperada lista vacia')
                setIsEmptyList(true);
                setIsLoaded(true);
                sessionStorage.setItem('games',[]);
            } 
            // Si hay datos en DB, se carga la sesion y la lista con los datos
            else {
                console.log('Recuperados datos de BD')
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
                console.log('Recuperados datos de sesion')
                setList(JSON.parse(sessionStorage.getItem('games')));
                setIsEmptyList(false);
                setIsLoaded(true);
            } 
            
        }
        setPrevStatus(status);
    },[status])

    const safeWrite = newList => {
        setList(newList);
        sessionStorage.setItem('games', JSON.stringify(newList))
        setDoc(userDataRef, {games: JSON.stringify(newList)})
    }

    const handleAddItem = addedGame => {
        location.state = null
        var tmpList = [];
        if (sessionStorage.getItem('games') !== '') {
            tmpList = JSON.parse(sessionStorage.getItem('games'));
        }
        safeWrite([...tmpList, addedGame]);
    }

    const handleEditRemoveItem = newList => {
        safeWrite(newList);
    }

    const handleSorting = (sorting) => {
        var tmpList = [];
        if(sorting[0] === 'order') {
            tmpList = JSON.parse(sessionStorage.getItem('games'));
        } else {
            tmpList = [...list.sort(sortByProperty(sorting[0], sorting[1]))];
        }
        setList(tmpList)    
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
                    var normalizedA = parseInt(a[property].replace(',', '.').replace(':', '.'))
                    var normalizedB = parseInt(b[property].replace(',', '.').replace(':', '.'))
                    var result = (normalizedA < normalizedB) ? -1 : (normalizedA > normalizedB) ? 1 : 0;
                    return result * sortOrder;
                }
            case 'rating':
                return function (a,b) {
                    var normalizedA = parseInt(a[property].reduce((partialSum, a) => partialSum + a, 0));
                    var normalizedB = parseInt(b[property].reduce((partialSum, a) => partialSum + a, 0));
                    var result = (normalizedA < normalizedB) ? -1 : (normalizedA > normalizedB) ? 1 : 0;
                    return result * sortOrder;
                }
            default:
                return function (a,b) {
                    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
        }
        
    }

    return (
        <Row className={isTabletOrMobile ? 'mainContainerMobile' : 'mainContainer'}>
            {isTabletOrMobile 
            ?   <>
                    <ListMobile list = {list} isEmptyList = {isEmptyList} isListLoaded = {isLoaded} handleEditRemoveItem = {handleEditRemoveItem} />
                </>
            :   <List list = {list} isEmptyList = {isEmptyList} isListLoaded = {isLoaded} handleEditRemoveItem = {handleEditRemoveItem} handleSorting = {handleSorting} />
            }
           
        </ Row>
    )
}

export default ListContainer
