import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import Game from '../Game';
import { MdDragHandle } from 'react-icons/md';
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
        <li ref={setNodeRef} {...attributes} style={style} className='gameWrapper'>
            <button ref={setActivatorNodeRef} {...listeners} className='gameSortHandle'><MdDragHandle/></button>
            <Game ref={setNodeRef} onClickRemoveItem = {props.onClickRemoveItem} onClickEditItem = {props.onClickEditItem} game = {props.game}/> 
        </li>
        
    );
}

export default SortableGame