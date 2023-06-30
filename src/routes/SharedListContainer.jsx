import { doc} from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import { Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth, useFirebaseApp, useFirestore, useFirestoreDocDataOnce } from 'reactfire';


import ListMobile from '../components/ListMobile';
import SharedList from '../components/SharedList';
const UserListContainer = () => {
 
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    const {userId} = useParams();

    const location = useLocation();
    const firebaseApp = useFirebaseApp();
    const auth = useAuth(firebaseApp);
    const firestore = useFirestore();
    const userDataRef = doc(firestore, 'lists', userId);

    const {status, data} = useFirestoreDocDataOnce(userDataRef);

    const [list, setList] = useState([]);

    useEffect(() => {
        if(status === 'success' && data !== undefined) {
            setList(JSON.parse(data.games));
        }
    },[status])

    return (
        <Row className={isTabletOrMobile ? 'mainContainerMobile' : 'mainContainer'}>
            {isTabletOrMobile 
            ?   <>
                    <ListMobile list = {list} />
                </>
            :   <SharedList list = {list}  userId = {userId}/>
            } 
        </ Row>
    )
}

export default UserListContainer