import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <h2>Home page</h2>
        <p>Home Page for List Management Application</p>
        <p>Please navigate to <Link to="/lists">available lists</Link> to see overview, add, edit or delete list</p>
      </div>
    );
  }
}