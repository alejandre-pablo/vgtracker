import { doc} from 'firebase/firestore';
import React, {useEffect, useState} from 'react'
import { Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocDataOnce } from 'reactfire';


import ListMobile from '../components/ListMobileCards';
import SharedList from '../components/SharedList';
const UserListContainer = () => {
 
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    const {userId} = useParams();

    const firestore = useFirestore();
    const userDataRef = doc(firestore, 'lists', userId);

    const {status, data} = useFirestoreDocDataOnce(userDataRef);

    const [isLoaded, setIsLoaded] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => {
        if(status === 'success' && data !== undefined) {
            setList(JSON.parse(data.games));
            setIsLoaded(true);
        }
    },[status, data])

    return (
        <Row className={isTabletOrMobile ? 'mainContainerMobile' : 'mainContainer'}>
            {isTabletOrMobile 
            ?   <>
                    <ListMobile list = {list} />
                </>
            :   <SharedList list = {list}  userId = {userId} isListLoaded = {isLoaded}/>
            } 
        </ Row>
    )
}

export default UserListContainer