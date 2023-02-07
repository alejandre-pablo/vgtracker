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
            setList(JSON.parse(data.games));
            sessionStorage.setItem('games', data.games)
        }
        if(prevStatus === 'none' && status === 'success') {
            setList(JSON.parse(sessionStorage.getItem('games')));
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
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    return (
        <Row className={isTabletOrMobile ? 'mainContainerMobile' : 'mainContainer'}>
            {isTabletOrMobile 
            ?   <>
                    <ListMobile list = {list} handleEditRemoveItem = {handleEditRemoveItem} />
                </>
            :   <List list = {list} handleEditRemoveItem = {handleEditRemoveItem} handleSorting = {handleSorting} />
            }
           
        </ Row>
    )
}

export default ListContainer
