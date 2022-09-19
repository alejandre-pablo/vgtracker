import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import Game from './Game';
import { TiArrowUnsorted } from 'react-icons/ti';
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
        <div ref={setNodeRef} {...attributes} style={style} className='gameWrapper'>
            <span className='gameSortIndex'>{props.index}</span>
            <button ref={setActivatorNodeRef} {...listeners} className='gameSortHandle'><TiArrowUnsorted/></button>
            <Game ref={setNodeRef} onClickRemoveItem = {props.onClickRemoveItem} onClickEditItem = {props.onClickEditItem} game = {props.game}/> 
        </div>
        
    );
}

export default SortableGame