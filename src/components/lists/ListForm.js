import React, { Component } from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";

class ListForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      column: {},
      columns: [],
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    const columnId = this.props.columns ? this.props.columns.length + 1 : 1;
    if (name === "columnName") {
      this.setState({
        column: {
          ...this.state.column,
          columnId,
          [name]: value
        }
      })
    }
  }

  render() {
    const {
      value,
      handleSave,
      handleChange,
      handleAdd,
      handleRemoveAddedSkill,
      cancelEdit,
      errors = {},
      columns,
      mode
    } = this.props;
    return (
      <div className="entryForm">
        <h2>Add new list</h2>
        <form onSubmit={handleSave}>
          <TextInput
            name="title"
            label="Title"
            value={value}
            onChange={handleChange}
            error={errors.dictionary}
          />

          {mode === "edit" && <div className="form-group" >
            <div>
              <TextInput
                name="columnName"
                label="Column"
                defaultOption="Add column"
                onChange={this.handleChange}
              />
              <button onClick={(e) => { e.preventDefault(); handleAdd(this.state.column) }}>Add Column</button>
            </div>
            <div>
              {
                columns && columns.map(column => (
                  <ul className="list-unstyled" key={column.columnId}>
                    <li>{column.columnName} <button onClick={() => { handleRemoveAddedSkill(column.columnId) }} className="btn">x</button></li>
                  </ul>
                ))
              }
              {/* <button className="btn btn-primary">Save</button> */}
            </div>
          </div>}
          {mode === "add" && <button>Add</button>}
          {mode === "edit" && (
            <>
              <button>Update</button>
              {" | "}
              <button onClick={cancelEdit}>Cancel</button>
            </>
          )}
        </form>
      </div >
    );
  }
}

ListForm.propTypes = {
  value: PropTypes.string,
  handleSave: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default ListForm;
