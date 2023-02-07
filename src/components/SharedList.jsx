import React, { useState} from 'react'
import { Tab, Nav, Col, Row, Spinner  } from 'react-bootstrap';
import Game from './Game'


const SharedList = (props) => {
    const {list} = props;

    const gameListFinished = 
        <ul>
            {list.filter(game => game.playstatus === "finished" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>   

    const gameListPlaying = 
        <ul>
            {list.filter(game => game.playstatus === "playing" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListOnHold = 
        <ul>
            {list.filter(game => game.playstatus === "onhold" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListDropped = 
        <ul>
            {list.filter(game => game.playstatus === "dropped" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListOther = 
        <ul>
            {list.filter(game => game.playstatus === "other" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul>  

    const gameListPlanToPlay = 
        <ul>
            {list.filter(game => game.playstatus === "plantoplay" ).map ((game, index) => (
                <li key = {game.id} className={index % 2 === 0 ? 'highlight' : ''}>
                    <Game key = {game.id} id={game.id} game ={game} index ={index + 1}/>
                </li>))
            }
        </ul> 

    const listHeader = 
    <Row className='listHeader'>
        <div className='columnTitle' style={{width:'6vw'}}> # </div>
        <div className='columnTitle' style={{width:'9vw'}}></div>
        <div className='columnTitle' style={{width:'22vw'}}> TITLE </div>
        <div className='columnTitle' style={{width:'10vw'}}> PLATFORM</div>
        <div className='columnTitle' style={{width:'10vw'}}> PLAYTIME </div>
        <div className='columnTitle' style={{width:'10vw'}}> DATE </div>
        <div className='columnTitle' style={{width:'15vw'}}> RATING </div>
        <div className='columnTitle' style={{width:'6vw'}}></div>
    </Row>

    const listHeaderPlanToPlay = 
    <Row className='listHeader'>
        <div className='columnTitle' style={{width:'6vw'}}> # </div>
        <div className='columnTitle' style={{width:'9vw'}}></div>
        <div className='columnTitle' style={{width:'30vw'}}>TITLE</div>
        <div className='columnTitle' style={{width:'33vw'}}></div>
    </Row>
    
    return (
        <>
        <Tab.Container id="tabs" defaultActiveKey="Finished" className='gamesList'>
            <Row>
                <Col className='sideBarColumn'>
                    <Nav variant="pills" className="flex-column tabSelectors">
                        <Nav.Item className='tabFinished'>
                            <Nav.Link eventKey="Finished">Completed</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabPlaying'>
                            <Nav.Link eventKey="Playing">Playing</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabOnHold'>
                            <Nav.Link eventKey="OnHold">On Hold</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabDropped'>
                            <Nav.Link eventKey="Dropped">Dropped</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabOthers'>
                            <Nav.Link eventKey="Other">Other</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='tabPlanToPlay'>
                            <Nav.Link eventKey="PlanToPlay">Plan to Play</Nav.Link>
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