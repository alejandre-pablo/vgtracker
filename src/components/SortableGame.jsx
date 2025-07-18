import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Game from './Game';
import { TiArrowUnsorted } from 'react-icons/ti';
import { Row } from 'react-bootstrap';
const SortableGame = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id: props.id});
      
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1
    };
      
    return (
        <Row ref={setNodeRef} {...attributes} style={style} className='gameWrapper'>
            <div className='gameSortWrapper' style={{width: '3.5vw'}}>
            <span className={props.isFiltered ? 'gameSortIndexSorted' : 'gameSortIndex'}>{props.index}</span>
            {props.isFiltered ? <></> : <button ref={setActivatorNodeRef} {...listeners} className='gameSortHandle'><TiArrowUnsorted/></button>}
            </div>
            <div style={{width: '96%'}}>
                <Game ref={setNodeRef} onClickRemoveItem = {props.onClickRemoveItem} onClickEditItem = {props.onClickEditItem} game = {props.game}/> 
            </div>    
        </Row>
        
    );
}

export default SortableGame