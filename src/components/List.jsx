import React from 'react'
import { Tab, Nav, Col, Row  } from 'react-bootstrap';

import Game from './Game'

const List = (props) => {
    const {list, setList} = props;
    const onClickRemoveItem = (title) => {
        if(window.confirm("Delete this entry?")) {
            var tmpList = list.filter((item => item.title !== title))
            if(tmpList !== list) {
                localStorage.setItem('games', tmpList) 
            }
            setList(tmpList);
        }
    };
 
    const gameListFinished = list.map ((game) => (
        game.playstatus === "finished" ? 
            <Game key={game.title} onClickRemoveItem ={onClickRemoveItem} game ={game} />
        : <></>  
    ));
    const gameListPlaying = list.map ((item) => (
        item.playstatus === "playing" ? 
            <Game onClickRemoveItem = {onClickRemoveItem} game = {item} />
        : <></>  
    ));
    const gameListOnHold = list.map ((item) => (
        item.playstatus === "onhold" ? 
            <Game onClickRemoveItem = {onClickRemoveItem} game = {item} /> 
        : <></>  
    ));
    const gameListDropped = list.map ((item) => (
        item.playstatus === "dropped" ? 
            <Game onClickRemoveItem = {onClickRemoveItem} game = {item} /> 
        : <></>  
    ));
    const gameListOther = list.map ((item) => (
        item.playstatus === "other" ? 
            <Game onClickRemoveItem = {onClickRemoveItem} game = {item} /> 
        : <></>  
    ));

    const listHeader = 
    <Row className='listHeader'>
        <Col md = {4} className="columnTitle">TITLE</Col>
        <Col className='columnTitle '>PLATFORM</Col>
        <Col className='columnTitle '>PLAYTIME</Col>
        <Col className='columnTitle'>RATING</Col>
        <Col className='columnFill'><div className='bookmark'></div></Col>
    </Row>

    return (
        <ul className='gamesList'>
            <Tab.Container id="tabs" defaultActiveKey="Finished">
                <Row>
                    <Col sm = {2} className='sideBarColumn'>
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
                        </Nav>
                    </Col>
                    <Col sm = {10} className='listColumn'>
                        <Tab.Content>
                            <Tab.Pane eventKey="Finished" className='listFinished'>
                                {listHeader}
                                {list.length ? gameListFinished : "No games added yet"}
                            </Tab.Pane>
                            <Tab.Pane eventKey="Playing" className='listPlaying'>
                                {listHeader}
                                {list.length ? gameListPlaying : "No games added yet"}
                            </Tab.Pane>
                            <Tab.Pane eventKey="OnHold" className='listOnHold'>
                                {listHeader}
                                {list.length ? gameListOnHold : "No games added yet"}
                            </Tab.Pane>
                            <Tab.Pane eventKey="Dropped" className='listDropped'>
                                {listHeader}
                                {list.length ? gameListDropped : "No games added yet"}
                            </Tab.Pane>
                            <Tab.Pane eventKey="Other" className='listOther'>
                                {listHeader}
                                {list.length ? gameListOther : "No games added yet"}
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </ul>
    )
}

export default List
