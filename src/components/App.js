import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NavBar from "./NavBar";
import ItemsPage from './dnd/ItemsPage';
import './App.css';
import HomePage from './HomePage';
import ListsPage from './lists/ListsPage';

export default function App(props) {

  return (
    <div className="main">
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/lists" component={ListsPage} />
        <Route exact path='/entries/:listId' component={ItemsPage} />
      </Switch>
    </div>
  );
}