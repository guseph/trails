import React from 'react';

import { withFirebase } from '../Firebase';
import "./SignOut.css";

const SignOutButton = ({ firebase }) => (
  <button id = "sign-out" className = "item right floated" type="button" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);