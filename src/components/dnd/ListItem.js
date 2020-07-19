import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { Flipper, Flipped } from 'react-flip-toolkit';
import addImage from "../../images/add_icon.png";
import remImage from "../../images/remove_icon.png";
//import connImage from "./images/connector.png";

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  backgroundColor: 'white',
  cursor: 'move',

}

function getStyle(backgroundColor, level) {
  return {
    border: '1px solid rgba(0,0,0,0.2)',
    color: 'black',
    backgroundColor,
    margin: 0,
    fontSize: '1rem',
    marginLeft: level * 25 + 'px',
    width: 'fit-content'
  }
}
export const ListItem = ({ id, text, moveCard, findCard, changeLevel, level, index, children, parentId, handleExpandCollapse, ec, path, pathToParent, rootParentId, visibility, card, columnNames, handleEdit, handleDelete }) => {

  const originalIndex = findCard(id).index;

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, cardtext: text, cardindex: index, originalIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      checkMove: monitor.getDifferenceFromInitialOffset()
    }),
    end: (dropResult, monitor) => {
      const { cardindex: droppedId, originalIndex } = monitor.getItem()
      const didDrop = monitor.didDrop()
      if (!didDrop) {
        moveCard(droppedId, originalIndex)
      }
    },
  });

  const [hasDropped, setHasDropped] = useState(false);
  const [hasDroppedOnChild, setHasDroppedOnChild] = useState(false);

  const [{ isOver, isOverCurrent, }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop(item, monitor) {
      const check = monitor.getDifferenceFromInitialOffset();
      const { index: overIndex } = findCard(id);
      console.log(item, ' overindex', overIndex);
      if (check.x > 20) {
        changeLevel(item.id, +1, overIndex);
      } else if (check.x < -20) {
        changeLevel(item.id, -1, overIndex);
      }

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
    }),

  });

  let backgroundColor = ''
  if (isOverCurrent) {
    backgroundColor = 'lightgreen'
  }
  const opacity = isDragging ? 0.5 : 1
  const display = visibility ? { display: '' } : { display: 'none' }
  return (
    <>
      <div ref={(node) => drag(drop(node))} style={{ ...getStyle(backgroundColor, level), opacity, ...display }}>
        {/* <Flipped flipId={id}> */}
        <div style={{ display: 'flex' }}>
          <ul>
            <li style={{ border: 0 }}><div style={{ marginRight: '5px', width: '20px' }}>{children && children.length > 0 && ec && <img id={id} className={ec} src={(ec === 'expanded') ? remImage : addImage} alt="expand collapse handle" style={{ width: '18px', height: '18px' }} onClick={handleExpandCollapse} />}</div></li>
            <li className="liListItem">{id}</li>
            {columnNames.map((columnName) => (<li className="liListItem">{card[columnName]}</li>))}
            <li className="liListItem">{level}</li>
            <li className="liListItem">{parentId}</li>
            {/* <li className="liListItem">{rootParentId}</li>
            <li className="liListItem">{'[' + children.reduce((acc, curr) => acc + ',' + curr, "") + ']'}</li>
            <li className="liListItem">{'[' + (path && path.reduce((acc, curr) => acc + ',' + curr, "")) + ']'}</li>
            <li className="liListItem">{'[' + (pathToParent && pathToParent.reduce((acc, curr) => acc + ',' + curr, "")) + ']'}</li> */}
            <li><button onClick={() => handleDelete(id)}>Delete</button></li>
            <li><button onClick={() => handleEdit(card)}>Edit</button></li>

          </ul>
        </div>
        {/* </Flipped> */}
      </div>
    </>
  )
}
