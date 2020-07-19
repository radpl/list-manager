/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Link, withRouter } from 'react-router-dom';
import styles from './navbar.module.css';

export default function NavBar(props) {
  return (
    <>
      <h1>List Management Application</h1>
      <nav className={styles.navMenu}>
        <ul className={styles.ulMenu}>
          <li className={styles.liItem}><Link to="/" className={styles.liMenu}>Home</Link></li>
          <li className={styles.liItem}><Link to="/lists" className={styles.liMenu}>Lists</Link></li>
        </ul>
      </nav>
    </>
  );
}
