import React, { useState, useEffect } from 'react'
import { ListItem } from './ListItem'
import { DropArea } from './DropArea'
import { getEntries, saveEntry, deleteEntry } from '../../api/entryApi';
import { getList } from '../../api/listApi';
import ItemForm from './ItemForm';
import { Flipper, Flipped } from 'react-flip-toolkit';

const style = {
  paddingRight: '80px',
  marginTop: '10px',
  width: 'fit-content'
}

export const ItemsPage = (props) => {

  const [cards, setCards] = useState([]);
  const [item, setItem] = useState({});
  const [listId, setListId] = useState();
  const [nextId, setNextId] = useState(0);
  const [currentList, setList] = useState({});
  const [columnNames, setColumnNames] = useState([]);
  const [mode, setMode] = useState("add");
  const [toggleFormVisibility, setFormVisibility] = useState(true);

  const newItm = {
    listId: null,
    id: null,
    level: 0,
    parentId: null,
    rootParentId: null,
    path: null,
    pathToParent: null,
    children: [],
    visible: true
  };

  const [newItem, setNewItem] = useState(newItm);

  const handleToggleFormVisibility = (current) => {
    setFormVisibility(!current);
  }

  useEffect(() => {
    const listId = props.match.params.listId;
    if (listId) setListId(listId);

    getEntries(listId).then(result => {
      setCards(result);
      const nextId = result && result.length > 0 ? +result[result.length - 1].id + 1 : 1;
      setNextId(nextId);
    });

    getList(listId).then(result => {
      setList(result);
      if (result.columns) {
        const columnNamesArr = result.columns.map(column => column.columnName);
        const columnNames = result.columns.reduce(function (acc, current) {
          acc[current.columnName] = null;
          return acc;
        }, {});

        const newItm = { ...newItem, ...columnNames };
        setNewItem(newItm);
        setColumnNames(columnNamesArr);
      }
    });

  }, [props.match.params.listId])


  const handleChange = event => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value })
    // this.setState({
    //   entry: {
    //     ...this.state.entry,
    //     [name]: value
    //   }
    // });
  };

  const handleSave = async event => {
    event.preventDefault();
    //if (!this.isEntryValid()) return;

    // const { entry, entries } = this.state;

    if (mode === "edit") {
      try {
        await saveEntry(item);
        setMode("add");

        const entriesNew = [...cards];
        const index = entriesNew.findIndex(obj => obj.id === item.id);
        entriesNew[index] = { ...item };
        setCards(entriesNew);

        const itm = { ...item };
        columnNames.forEach(col => { itm[col] = null });
        setItem(itm);

      } catch (error) {
        console.log(error);
      }

      return;
    }

    try {
      if (!listId) return;
      const itemId = nextId;
      const itemToSave = { ...newItem, ...item, listId, path: [item.id] }
      //item.listId = listId;
      const result = await saveEntry(itemToSave);
      const resultwithPath = await saveEntry({ ...result, path: [result.id] })
      setNextId(+result.id + 1);
      setCards([...cards, resultwithPath]);
      //this.setState({ nextId: +result.id + 1 });
      //this.setState({ entries: [...entries, result], entry: Object.assign({}, { dictId: this.state.dictId, domain: "", range: "", drKey: "", rdKey: "" }) });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditEntry = item => {
    setItem({ ...item });
    setMode("edit");
  };

  const handleDelete = async entryId => {
    try {
      await deleteEntry(entryId);
      // const filteredEntries = cards.filter(item => item.id != entryId);
      // setCards(filteredEntries);
    } catch (error) {
      console.log("Delete failed " + error.message);
    }
  };

  const deleteCascade = (entryId, level = 0, acc = []) => {
    const { card, index } = findCard(entryId);
    if (card.children.length > 0) {
      card.children.forEach(entryId => {
        deleteCascade(entryId, level + 1, acc);
        //handleDelete(entryId);
      });
    }
    acc.push(entryId);
    handleDelete(entryId);
    if (level === 0) {
      const filteredEntries = cards.filter(item => !acc.find(el => el == item.id));
      setCards(filteredEntries);
    }
  }

  const handleCancelEdit = () => {
    setMode("add");
    const itm = { ...item };
    columnNames.forEach(col => {
      itm[col] = null
    })
    setItem(itm);
  };

  const changeLevel = (id, level, overIndex) => {
    const { card, index: cardindex } = findCard(id);

    //if the same element
    if (cardindex === overIndex) {
      card.level += level; //add or substract one level
      if (card.level <= 0) {
        card.level = 0;
      }
      //adjust parent details
      if (level < 0) {

        const { card: parent, index: parentIndex } = findCard(card.parentId);
        if (parent && card.level + (-level) - parent.level === 1) {
          card.parentId = parent.parentId;
          card.rootParentId = parent.rootParentId;
          if (card.level === 0) {
            card.pathToParent = null;
            card.path = [card.id];
          } else {
            card.pathToParent = parent.pathToParent;
            card.path = [...parent.pathToParent, card.id];
          }

          const newChildren = parent.children.filter(item => item !== +card.id)
          cardChildrenLevels(card, 1);
          parent.children = [...newChildren];
          if (parent.children.length === 0) {
            parent.ec = '';
          }
          const newCards = cards.map((item, index) => {

            if (index === parentIndex) {
              return { ...item, ...parent };
            }
            if (index !== cardindex) {
              return item
            }
            return {
              ...item,
              ...card
            }
          });
          setCards(newCards);

        } else {
          cardChildrenLevels(card, 1);
          const newCards = cards.map((item, index) => {
            if (index !== cardindex) {
              return item
            }
            return {
              ...item,
              ...card
            }
          });

          setCards(newCards);
        }


      } else {
        cardChildrenLevels(card, 1);
        const newCards = cards.map((item, index) => {
          if (index !== cardindex) {
            return item
          }
          return {
            ...item,
            ...card
          }
        });

        setCards(newCards);
      }


    } else {
      const parent = cards[overIndex];
      const parentLevel = parent.level;

      //add parent
      if (!card.parentId) {
        card.parentId = parent.id;
        card.level += parentLevel;
        card.path = [...parent.path, id];
        card.pathToParent = parent.path.slice();
        card.rootParentId = card.path[0];
        parent.children = [...parent.children, +card.id];
        parent.ec = 'expanded';
      }

      card.level += level;
      if (card.level < 0) card.level = 0;

      cardChildrenLevels(card, 1);

      const newCards = cards.map((item, index) => {
        if (index !== cardindex) {
          return item;
        }
        if (index === overIndex) {
          return { ...item, ...parent };
        }
        return { ...item, ...card };
      });

      newCards.splice(cardindex, 1);
      newCards.splice(overIndex + parent.children.length, 0, card);

      setCards(newCards);

    }

    if (card.level === 0 && card.parentId) {
      const { card: parent, index: parentIndex } = findCard(card.parentId); //cards.find(el => el.id === card.parentId);
      card.parentId = null;
      card.rootParentId = null;
      card.pathToParent = null;
      card.path = [card.id];
      const newChildren = parent.children.filter(item => item !== +card.id)
      cardChildrenLevels(card, 1);
      parent.children = [...newChildren];
      if (parent.children.length === 0) {
        parent.ec = '';
      }

      const newCards = cards.map((item, index) => {

        if (index === parentIndex) {
          return { ...item, ...parent };
        }
        return item;
      });
      setCards(newCards);
    }

  }

  const cardChildrenLevels = (card, level, newArray, count = 0) => {

    let arr;
    if (newArray) {
      arr = newArray;
    } else {
      arr = cards.slice();
    }

    const children = card.children.slice();
    for (let i = 0; i < children.length; i++) {
      const child = arr.find((c) => c.id == children[i]);
      child.level = card.level + level;
      child.path = [...card.path, child.id];
      child.pathToParent = [...card.path];
      child.rootParentId = card.path[0];
      cardChildrenLevels(child, level, arr, ++count);
    }

    if (count === 0)
      setCards(arr);

  }

  const moveCard = (id, atIndex, moveDirection, newArray, level = 0) => {

    let arr;
    if (newArray) {
      arr = newArray;
    } else {
      arr = cards.slice();
    }

    const { card, index } = findCardInArr(id, arr);

    if (card) {
      const children = card.children;

      arr.splice(index, 1);
      arr.splice(atIndex, 0, card);

      if (children && children.length > 0) {
        children.forEach((item, i) => {
          const child = arr.find((c) => c.id === +item);
          const move = moveDirection === 'down' ? 0 : 1;
          moveCard(child.id, atIndex + move, moveDirection, arr, level + 1);
        })
      }
      if (level === 0)
        setCards(arr);
    }
  }

  const findCardInArr = (id, arr) => {
    const card = arr.filter((c) => `${c.id}` == id)[0]
    return {
      card,
      index: arr.indexOf(card),
    }
  }

  const findCard = (id) => {
    const card = cards.filter((c) => `${c.id}` == id)[0]
    return {
      card,
      index: cards.indexOf(card),
    }
  }

  const handleExpandCollapse = (event) => {
    event.preventDefault();
    const targetId = event.target.id;
    const className = event.target.className;
    const expanded = (" " + className + " ").replace(/[\n\t]/g, " ").indexOf(" expanded ") > -1
    const collapsed = (" " + className + " ").replace(/[\n\t]/g, " ").indexOf(" collapsed ") > -1

    const newCards = cards.map(item => {
      const check = item.pathToParent && item.pathToParent.some(el => el == targetId);

      if (check) {
        if (expanded) item.visible = false;
        if (collapsed) item.visible = true;
      }

      if (item.id == targetId) {
        if (expanded) {
          item.ec = 'collapsed'
        } else {
          item.ec = 'expanded'
        }
      }

      return item;

    });

    setCards(newCards);
  }


  return (
    <>
      {/* <div ref={drop} style={style}> */}
      <Flipper flipKey={toggleFormVisibility}>
        <ItemForm
          handleChange={handleChange}
          handleSave={handleSave}
          item={item}
          columnNames={columnNames}
          cancelEdit={handleCancelEdit}
          handleToggle={handleToggleFormVisibility}
          mode={mode}
          formVisible={toggleFormVisibility}
        />
      </Flipper>
      <div style={style}>
        {/* <Flipper flipKey={cards.map((item) => item.id).join(".")}> */}
        <ul className="ulListItemHeader">
          <li ><div style={{ width: '24px' }}></div></li>
          <li className="liListItem">id</li>
          {columnNames.map((columnName) => (<li className="liListItem">{columnName}</li>))}
          <li className="liListItem">level</li>
          <li className="liListItem">parentId</li>
          {/* <li className="liListItem">rootParentId</li>
          <li className="liListItem">children</li>
          <li className="liListItem">path</li>
          <li className="liListItem">pathToParent</li> */}
        </ul>
        {cards.map((card, index) => {
          // if (card.visible)
          return (
            <>
              <DropArea visibility={card.visible} type="top" cardId={card.id} index={index} moveCard={moveCard} findCard={findCard} />
              <ListItem
                visibility={card.visible}
                key={card.text}
                id={`${card.id}`}
                index={index}
                text={card.text}
                moveCard={moveCard}
                findCard={findCard}
                changeLevel={changeLevel}
                handleExpandCollapse={handleExpandCollapse}
                handleEdit={handleEditEntry}
                handleDelete={deleteCascade}
                level={card.level}
                children={card.children}
                parentId={card.parentId}
                rootParentId={card.rootParentId}
                path={card.path}
                pathToParent={card.pathToParent}
                ec={card.ec}
                card={card}
                columnNames={columnNames}
              />
              <DropArea visibility={card.visible} type="bottom" cardId={card.id} index={index} moveCard={moveCard} findCard={findCard} />
            </>
          )
          // else
          //   return (<div key={card.id}>
          //     <DropArea type="top" cardId={card.id} index={index} moveCard={moveCard} findCard={findCard} />
          //     <DropArea type="bottom" cardId={card.id} index={index} moveCard={moveCard} findCard={findCard} />
          //   </div>);
        }
        )}
        {/* </Flipper> */}
      </div>
    </>
  )
}

export default ItemsPage;