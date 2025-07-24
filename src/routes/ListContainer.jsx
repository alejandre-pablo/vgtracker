import React from 'react'
import { Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

import ListMobile from '../components/ListMobile';
import List from '../components/List';

const ListContainer = (props) => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    return (
        <Row className={isTabletOrMobile ? 'mainContainerMobile' : 'mainContainer'} id='main-container'>
            {isTabletOrMobile 
            ? <ListMobile list = {props.list} isEmptyList = {props.isEmptyList} isListLoaded = {props.isLoaded}  handleEditItem = {props.handleEditItem} handleRemoveItem = {props.handleRemoveItem} handleOrderList = {props.handleOrderList}/>
            : <List editable={true} list = {props.list} isEmptyList = {props.isEmptyList} isListLoaded = {props.isLoaded} onEditItem = {props.handleEditItem} onRemoveItem = {props.handleRemoveItem} onReorderList = {props.handleOrderList}/>
            }  
        </ Row>
    )
}

export default ListContainer
