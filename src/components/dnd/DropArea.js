import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { Flipper, Flipped } from 'react-flip-toolkit';


const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  backgroundColor: 'white',
  cursor: 'move',
}

function getStyle(backgroundColor, level) {
  return {
    border: '1px solid rgba(0,0,0,0.2)',
    color: 'white',
    backgroundColor,
    paddingTop: '1rem',
    margin: '5px',
    fontSize: '1rem',
    marginLeft: level * 18 + 'px'
  }
}
export const DropArea = ({ type, cardId, moveCard, findCard, index, visibility }) => {

  const originalIndex = findCard(cardId).index;
  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);

  const [{ isOver, isOverCurrent, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop(item, monitor) {
      const { index: overIndex } = findCard(cardId);
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }
      setHasDropped(true)
      setHasDroppedOnChild(didDrop)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      item: monitor.getItem(),
      canDrop: monitor.canDrop(),
    }),
    hover({ id: draggedId, cardindex }, monitor) {
      const check = monitor.getDifferenceFromInitialOffset();
      console.log('initial', monitor.getInitialClientOffset());
      console.log('source', monitor.getSourceClientOffset());
      console.log('initial source', monitor.getInitialSourceClientOffset());
      console.log('difference', monitor.getDifferenceFromInitialOffset());
      //console.log(check);
      if (draggedId !== cardId) {
        const { card: dCard, index: dIndex } = findCard(draggedId);
        const { card: oCard, index: overIndex } = findCard(cardId);
        if (check.x <= 20 && check.x >= -20) {
          if (dCard.children && dCard.children.length > 0) {
            const isChild = dCard.children.find(el => {
              return +el === +cardId
            });
            if (!isChild) {
              const moveDirection = check.y < 0 ? 'up' : 'down';
              moveCard(draggedId, overIndex, moveDirection);
            };
          } else {
            const moveDirection = check.y < 0 ? 'up' : 'down';
            moveCard(draggedId, overIndex, moveDirection)
          }
        }
      }
    },
  });

  let backgroundColor = 'rgba(0, 0, 0, .5)';
  const display = visibility ? { height: '2px' } : { height: '0.1px' };

  if (isOverCurrent) {
    backgroundColor = 'lightgreen'
  }
  //const opacity = isDragging ? 0 : 1
  const hightlight = canDrop && !isOverCurrent ? { backgroundColor: 'lightblue' } : { backgroundColor: '' };
  //const current = isOverCurrent ? { height: '40px' } : { height: '2px' };
  return (
    <>
      <div type={type} ref={(node) => drop(node)} style={{ height: '2px', ...hightlight, ...display }}></div>
    </>
  )
}
