import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ListsDetails = props => {
  return (
    <div>
      <h2>Lists</h2>
      {props.lists === null && <p>Loading lists...</p>}
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Link</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {props.lists &&
            props.lists.map(list => (
              <tr key={list.id}>
                <td>{list.id}</td>
                <td>{list.title}</td>
                <td>
                  <Link to={"/entries/" + list.id}>Entries</Link>
                  {/* <Link to={"/entries/" + list.id + "/page/1"}>Entries</Link> */}
                </td>
                <td>
                  <button onClick={() => props.handleDelete(list.id)}>
                    Delete
                  </button>
                  {" | "}
                  <button onClick={() => props.handleEdit(list)}>Edit</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

ListsDetails.propTypes = {
  dictionaries: PropTypes.array,
  handleDelete: PropTypes.func.isRequired
};

export default ListsDetails;
