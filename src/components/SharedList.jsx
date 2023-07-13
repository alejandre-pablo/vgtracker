import React, { useEffect, useState} from 'react'
import { Tab, Nav, Col, Row, Spinner  } from 'react-bootstrap';
import SharedGame from './SharedGame'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { getDownloadURL, ref } from 'firebase/storage';
import { useFirestore, useFirestoreDocDataOnce, useStorage } from 'reactfire';
import { doc } from 'firebase/firestore';


const SharedList = (props) => {

    const {list, userId} = props;

    const storage = useStorage();
    const firestore = useFirestore();

    const [sortingCache, setSortingCache] = useState(['order', 'default']);
    const [isSorted, setIsSorted] = useState(false);

    const profileDataRef = doc(firestore, 'profiles', userId);
    const {status, data: profile} = useFirestoreDocDataOnce(profileDataRef);
    const [profilePictureURL, setProfilePictureUrl] = useState('');

    function handleSort (sorting) {
        if(sortingCache[0] === sorting) {
            if (sortingCache[1] === 'asc') {
                setSortingCache([sorting,'desc']);
                setIsSorted(true);
            } else {
                setSortingCache(['order','default']);
                setIsSorted(false);
            }
        } else {
            setSortingCache([sorting, 'asc']);
            setIsSorted(true);
        }
    }

    useEffect(() => {
        //Check if the user has a profile picture
        if(status === 'success' && profile.picture !== ''){
            // Fetch the profile picture URL from Firebase Storage
            const imageRef =ref(storage, `images/${userId}`)
            getDownloadURL(imageRef)
            .then(url => {
                // Set the profile picture URL in the state
                setProfilePictureUrl(url);
            })
            .catch(error => {
                console.error('Error fetching profile picture:', error);
            });
        }
        
    }, [status]);

    /* useEffect(() => {
        if(list.length > 0) {
            handleSorting(sortingCache);
        }
    }, [sortingCache]) */

    const gameListFinished = 
        <ul>
            {list.filter(game => game.playstatus === "finished" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SharedGame key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>   

    const gameListPlaying = 
        <ul>
            {list.filter(game => game.playstatus === "playing" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SharedGame key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListOnHold = 
        <ul>
            {list.filter(game => game.playstatus === "onhold" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SharedGame key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListDropped = 
        <ul>
            {list.filter(game => game.playstatus === "dropped" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SharedGame key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListOther = 
        <ul>
            {list.filter(game => game.playstatus === "other" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SharedGame key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListPlanToPlay = 
        <ul>
            {list.filter(game => game.playstatus === "plantoplay" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <SharedGame key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul> 

    const listHeader = 
    <Row className='listHeader'>
        <div className='columnTitle' style={{width:'6vw'}}> # </div>
        <div className='columnTitle' style={{width:'9vw'}}></div>
        <div className='columnTitle' style={{width:'22vw', cursor: 'default'}} onClick={() => handleSort('title')}> 
            TITLE 
            {sortingCache[0] !== 'title' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            
        </div>
        <div className='columnTitle' style={{width:'10vw', cursor: 'default'}} onClick={() => handleSort('platform')}> 
            PLATFORM
            {sortingCache[0] !== 'platform' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
        </div>
        <div className='columnTitle' style={{width:'10vw', cursor: 'default'}} onClick={() => handleSort('playtime')}> 
            PLAYTIME
            {sortingCache[0] !== 'playtime' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            </div>
        <div className='columnTitle' style={{width:'10vw', cursor: 'default'}} onClick={() => handleSort('playdate')}>
            DATE
            {sortingCache[0] !== 'playdate' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            </div>
        <div className='columnTitle' style={{width:'15vw', cursor: 'default'}} onClick={() => handleSort('rating')}>
            RATING
            {sortingCache[0] !== 'rating' ? <></>
            : sortingCache[1] === 'asc' ? <AiFillCaretUp/>
                :<AiFillCaretDown/>
            }
            </div>
        <div className='columnTitle' style={{width:'6vw'}}></div>
    </Row>

    const listHeaderPlanToPlay = 
    <Row className='listHeader'>
        <div className='columnTitle' style={{width:'6vw'}}> # </div>
        <div className='columnTitle' style={{width:'9vw'}}></div>
        <div className='columnTitle' style={{width:'22vw'}}>TITLE</div>
        <div className='columnTitle' style={{width:'37vw'}}></div>
    </Row>
    
    return (
        <>
        <Tab.Container id="tabs" defaultActiveKey="Finished" className='gamesList'>
            <Row>
                <Col md={2} className='sideBarColumn'>
                    <div className='sharedProfileCard'>
                        <img 
                        src={profilePictureURL ? profilePictureURL : window.location.origin +'/img/profile.svg.png'} 
                        referrerPolicy="no-referrer"  
                        alt='Profile Pic' 
                        style={{objectFit: 'cover',width: '100%', minHeight: '100%', borderRadius: '50%' }}/>
                        <strong>{profile ? profile.username : ''}</strong>
                    </div>
                    <Nav variant="pills" className="flex-column tabSelectors">
                        <Nav.Item className='tabFinished'>
                            <Nav.Link eventKey="Finished">COMPLETED</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabPlaying'>
                            <Nav.Link eventKey="Playing">PLAYING</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabOnHold'>
                            <Nav.Link eventKey="OnHold">ON HOLD</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabDropped'>
                            <Nav.Link eventKey="Dropped">DROPPED</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabOthers'>
                            <Nav.Link eventKey="Other">OTHER</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabPlanToPlay'>
                            <Nav.Link eventKey="PlanToPlay">PLAN TO PLAY</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col className='listColumn'>
                    <Tab.Content>
                        <Tab.Pane eventKey="Finished" >
                            {listHeader}
                            <Row className='scrollable'> 
                                    {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> : 
                                    list.length === 0 ? "No games added yet"
                                    : gameListFinished
                                    }
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="Playing" >
                            {listHeader}
                            <Row className='scrollable'> 
                                {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                    : list.length === 0 ? "No games added yet"
                                    : gameListPlaying
                                }
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="OnHold" >
                            {listHeader}
                            <Row className='scrollable'> 
                                {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                    : list.length === 0 ? "No games added yet"
                                    : gameListOnHold
                                }
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="Dropped" >
                            {listHeader}
                            <Row className='scrollable'> 
                                {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                    : list.length === 0 ? "No games added yet"
                                    : gameListDropped
                                }
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="Other" >
                            {listHeader}
                            <Row className='scrollable'> 
                                {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                    : list.length === 0 ? "No games added yet"
                                    : gameListOther
                                }
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="PlanToPlay" >
                            {listHeaderPlanToPlay}
                            <Row className='scrollable'> 
                                {!list.length ? <Spinner animation='grow' variant='light' style={{marginTop: '50%', margin: 'auto'}}/> 
                                    : list.length === 0 ? "No games added yet"
                                    : gameListPlanToPlay
                                }
                            </Row>
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        </>
    )
}

export default SharedList