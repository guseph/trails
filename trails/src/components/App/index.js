import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
// import AdminPage from '../Admin';
import MyExpenses from '../MyExpenses';
import AddReceipt from '../AddReceipt';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import "./App.css";

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />
      <div id = "main" className= "ui center aligned container">
        <Route exact path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route
          path={ROUTES.PASSWORD_FORGET}
          component={PasswordForgetPage}
        />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.MY_EXPENSES} component={MyExpenses} />
        <Route path={ROUTES.ADD_RECEIPT} component={AddReceipt} />
      </div>



    </div>
  </Router>
);

export default withAuthentication(App);