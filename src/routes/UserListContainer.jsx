import { doc, setDoc } from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import { Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useAuth, useFirebaseApp, useFirestore, useFirestoreDocDataOnce } from 'reactfire';

import List from '../components/List'
import ListMobile from '../components/ListMobile';
const UserListContainer = () => {
 
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    const {userId} = useParams();
    debugger

    const location = useLocation();
    const firebaseApp = useFirebaseApp();
    const auth = useAuth(firebaseApp);
    const firestore = useFirestore();
    const userDataRef = doc(firestore, 'lists', userId);

    const {status, data } = useFirestoreDocDataOnce(userDataRef);

    const [list, setList] = useState([]);

    const [prevStatus, setPrevStatus] = useState('none')

    useEffect(() => {
        if(prevStatus === 'loading' && status === 'success' && data !== undefined) {
            setList(JSON.parse(data.games));
        }
        if(prevStatus === 'none' && status === 'success') {
            setList(JSON.parse(sessionStorage.getItem('games')));
        }
        setPrevStatus(status);
    },[status])

    return (
        <Row className={isTabletOrMobile ? 'mainContainerMobile' : 'mainContainer'}>
            {isTabletOrMobile 
            ?   <>
                    <ListMobile list = {list} />
                </>
            :   <List list = {list} />
            }
           
        </ Row>
    )
}

export default UserListContainer