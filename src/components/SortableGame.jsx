import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Game from './Game';
import { Row, Form } from 'react-bootstrap';

const SortableGame = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.id });

    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(props.index);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1
    };

    const handleDoubleClick = () => {
        if (props.isFiltered) return;
        setIsEditing(true);
        setInputValue(props.index);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = () => {
        const newIndex = parseInt(inputValue);
        if (!isNaN(newIndex) && newIndex !== props.index && newIndex > 0) {
            props.onChangeIndex(props.id, newIndex);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    const handleBlur = () => {
        handleSubmit();
    };

    return (
        <Row ref={setNodeRef} {...attributes} style={style} className='gameWrapper'>
            <div className='gameSortWrapper'>
                {isEditing ? (
                    <Form.Control
                        type="number"
                        min={1}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        autoFocus
                        size="sm"
                        className="gameSortIndexInput"
                    />
                ) : (
                    <span
                        ref={!props.isFiltered && !isEditing ? setActivatorNodeRef : null}
                        {...(!props.isFiltered && !isEditing ? listeners : {})}
                        className='gameSortIndex'
                        onDoubleClick={handleDoubleClick}
                        title='Double-click to change position'
                    >
                        {props.index}
                    </span>
                )}
            </div>
            <Game
                ref={setNodeRef}
                onClickRemoveItem={props.onClickRemoveItem}
                onClickEditItem={props.onClickEditItem}
                game={props.game}
            />
        </Row>
    );
};

export default SortableGame;
