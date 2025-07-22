import React from 'react'
import { Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';


import List from '../components/List'
import ListMobile from '../components/ListMobile';
import ListMobileCards from '../components/ListMobileCards';

const ListContainer = (props) => {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'})

    return (
        <Row className={isTabletOrMobile ? 'mainContainerMobile' : 'mainContainer'}>
            {isTabletOrMobile 
            ? <ListMobile list = {props.list} isEmptyList = {props.isEmptyList} isListLoaded = {props.isLoaded}  handleEditItem = {props.handleEditItem} handleRemoveItem = {props.handleRemoveItem} handleOrderList = {props.handleOrderList}/>
            : <List list = {props.list} isEmptyList = {props.isEmptyList} isListLoaded = {props.isLoaded} handleEditItem = {props.handleEditItem} handleRemoveItem = {props.handleRemoveItem} handleOrderList = {props.handleOrderList}/>
            }  
        </ Row>
    )
}

export default ListContainer
