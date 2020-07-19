import React from "react";
import ListsDetails from "./ListsDetails";
import { saveList, getLists, deleteList } from "../../api/listApi";
import { getEntries, saveEntry } from '../../api/entryApi';
import { deleteBulkEntries } from "../../api/entryApi";
import ListForm from "./ListForm";

class ListPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: null,
      list: {},
      errors: {},
      mode: "add"
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      list: {
        ...this.state.list,
        [name]: value
      }
    });
  };

  handleSave = async event => {
    event.preventDefault();
    if (!this.isValid()) return;
    const { list, lists } = this.state;

    if (this.state.mode === "edit") {
      const listId = list.id;
      try {
        await saveList(list);
        this.setState(prevState => {
          const listsNew = [...prevState.lists];
          const index = listsNew.findIndex(
            obj => obj.id === list.id
          );
          listsNew[index] = { ...list };
          return {
            lists: listsNew,
            mode: "add",
            list: Object.assign({}, { title: "" })
          };
        });

        const entries = await getEntries(listId);
        const first = entries[0];
        const columns = list.columns.map(col => col.columnName);
        const columnsToUpdate = {};
        let entriesShouldUpdate = false;
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (!first.hasOwnProperty(column)) {
            columnsToUpdate[column] = null;
            entriesShouldUpdate = true;
          }
        }

        if (entriesShouldUpdate) {
          const updatedEntries = entries.map(entry => { return { ...entry, ...columnsToUpdate } });
          updatedEntries.forEach(entry => saveEntry(entry));
        }


      } catch (error) {
        console.log(error);
      }

      return;
    }

    const found = lists.find(item => item.title === list.title);
    if (found) {
      return;
    }
    try {
      list.columns = [];
      const result = await saveList(list);
      this.setState({ lists: [...lists, result], list: Object.assign({}, { title: "" }) });
    } catch (error) {
      console.log(error);
    }
  };

  isValid = () => {
    const { list, lists } = this.state;
    const errors = {};
    let valid = true;

    if (!list.title) {
      errors.dictionary = "Title is required.";
      valid = false;
    }

    const exists = lists.find(item => item.title === list.title);
    if (exists && this.state.mode === "add") {
      errors.list = "Title already used.";
      valid = false;
    }
    this.setState({ errors });
    return valid;
  };

  handleDelete = async listId => {
    try {
      await deleteList(listId);
      const filteredLists = this.state.lists.filter(item => item.id !== listId);
      this.setState({ lists: filteredLists });

      await deleteBulkEntries(listId);

    } catch (error) {
      console.log("Delete failed " + error.message);
    }
  };

  handleListEdit = list => {
    this.setState({ list: { ...list }, mode: "edit" });
  };

  handleCancelEdit = (event) => {
    event.preventDefault();
    this.setState(prevState => ({
      mode: "add",
      dictionary: { ...prevState.list, title: "" }
    }));
  };

  async componentDidMount() {
    try {
      const lists = await getLists();
      this.setState({ lists });
    } catch (err) {
      console.log("Error", err);
    }
  }

  handleRemoveAddedSkill = (columnId) => {
    const filteredColumns = this.state.list.columns.filter(item => item.columnId !== columnId);
    const list = { ...this.state.list, columns: [...filteredColumns] };
    //currentList.columns = [...filteredColumns];
    this.setState({
      list
    });
  }

  handleAdd = (column) => {

    const columnName = this.state.list.columns.find((col) => col.columnName === column.columnName);
    if (!columnName) {
      const list = { ...this.state.list, columns: [...this.state.list.columns, { ...column }] };
      this.setState({
        list
      });
    }
  }

  render() {
    return (
      <>
        <ListForm
          handleChange={this.handleChange}
          handleSave={this.handleSave}
          cancelEdit={this.handleCancelEdit}
          handleAdd={this.handleAdd}
          handleRemoveAddedSkill={this.handleRemoveAddedSkill}
          value={this.state.list.title}
          errors={this.state.errors}
          mode={this.state.mode}
          columns={this.state.list.columns}
        />
        <ListsDetails
          lists={this.state.lists}
          handleDelete={this.handleDelete}
          handleEdit={this.handleListEdit}
        />
      </>
    );
  }
}

export default ListPage;
