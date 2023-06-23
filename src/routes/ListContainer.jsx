import React from 'react'
import { Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';


import List from '../components/List'
import ListMobile from '../components/ListMobile';

const ListContainer = (props) => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    return (
        <Row className={isTabletOrMobile ? 'mainContainerMobile' : 'mainContainer'}>
            {isTabletOrMobile 
            ? <ListMobile list = {props.list} isEmptyList = {props.isEmptyList} isListLoaded = {props.isLoaded} handleEditRemoveItem = {props.handleEditRemoveItem} />
            : <List list = {props.list} isEmptyList = {props.isEmptyList} isListLoaded = {props.isLoaded} handleEditRemoveItem = {props.handleEditRemoveItem} handleSorting = {props.handleSorting} />
            }  
        </ Row>
    )
}

export default ListContainer
