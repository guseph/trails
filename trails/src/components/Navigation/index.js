import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div>
    <div class="ui top fixed menu">
      <Link class = "item" to={ROUTES.LANDING}>
        <img src="https://thumbs.dreamstime.com/b/money-cash-logo-vector-green-91037524.jpg"/>
      </Link>

      <Link class = "item" to={ROUTES.HOME}>Home</Link>
      <Link class = "item" to={ROUTES.ACCOUNT}>Account</Link>
      <Link class = "item" to={ROUTES.MY_EXPENSES}>MY EXPENSES</Link>
      <Link class = "item" to={ROUTES.ADD_RECEIPT}>Add Receipt</Link>
      <SignOutButton />

    </div>

  </div>

  // <ul>
  //   <li>
  //     <Link to={ROUTES.LANDING}>Landing</Link>
  //   </li>
  //   <li>
  //     <Link to={ROUTES.HOME}>Home</Link>
  //   </li>
  //   <li>
  //     <Link to={ROUTES.ACCOUNT}>Account</Link>
  //   </li>
  //   <li>
  //     <Link to={ROUTES.MY_EXPENSES}>MY EXPENSES</Link>
  //   </li>
  //   <li>
  //     <Link to={ROUTES.ADD_RECEIPT}>Add Receipt</Link>
  //   </li>
  //   <li>
  //     <SignOutButton />
  //   </li>
  // </ul>
);

const NavigationNonAuth = () => (
  <div>
    <div class="ui top fixed menu">
      <div class="item">
        <img src="https://thumbs.dreamstime.com/b/money-cash-logo-vector-green-91037524.jpg"/>
      </div>
      <Link class = "item" to={ROUTES.LANDING}>Landing</Link>
      <Link class = "item" to={ROUTES.SIGN_IN}>Sign In</Link>


    </div>

  </div>
  // <ul>
  //   <li>
  //     <Link to={ROUTES.LANDING}>Landing</Link>
  //   </li>
  //   <li>
  //     <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  //   </li>
  // </ul>
);

export default Navigation;