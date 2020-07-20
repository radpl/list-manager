import React, { Component } from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";
import { Flipped } from 'react-flip-toolkit';

class EntryForm extends Component {
  render() {
    const {
      item,
      handleSave,
      handleChange,
      errors = {},
      mode = "add",
      columnNames,
      formVisible,
      handleToggle
    } = this.props;
    const display = formVisible ? '' : 'none';
    return (
      <div className="entryForm">
        <h2 onClick={() => handleToggle(formVisible)}>Add Item</h2>
        <Flipped flipId="formToggle">
          <div className="formToggle" style={{ display }}>
            <form onSubmit={handleSave}>
              <div className="addItemForm">
                {columnNames.map((columnName) => {
                  return (<TextInput
                    name={columnName}
                    label={columnName}
                    value={item[columnName]}
                    onChange={handleChange}
                    error={errors.domain}
                    labelClass="entries"
                  />)
                })}
                {/* <TextInput
            name="text"
            label="Text"
            value={item.text}
            onChange={handleChange}
            error={errors.domain}
            labelClass="entries"
          /> */}
              </div>
              {mode === "add" && <button>Add</button>}
              {mode === "edit" && (
                <>
                  <button>Update</button>{" | "}
                  <button onClick={this.props.cancelEdit}>Cancel</button>
                </>
              )}
            </form>



            {
              errors && errors.entry && (
                <div className="input-error">{errors.entry}</div>
              )
            }

          </div >
        </Flipped>
      </div >
    );
  }
}

EntryForm.propTypes = {
  domain: PropTypes.string,
  range: PropTypes.string,
  checked: PropTypes.bool,
  handleSave: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCheck: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default EntryForm;
