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

const logoSrc = "https://thumbs.dreamstime.com/b/money-cash-logo-vector-green-91037524.jpg";

const NavigationAuth = () => (
  <div>
    <div class="ui top fixed menu">
      <Link class="item" to={ROUTES.LANDING}>
        <img alt = "logo" src={logoSrc} />
      </Link>

      <Link class="item" to={ROUTES.HOME}>Home</Link>
      <Link class="item" to={ROUTES.MY_EXPENSES}>Expenses</Link>
      <Link class="item" to={ROUTES.ADD_RECEIPT}>Add Receipt</Link>
      <Link class="item" to={ROUTES.ACCOUNT}>Account</Link>
     
      <SignOutButton />

    </div>

  </div>

);

const NavigationNonAuth = () => (
  <div>
    <div className="ui top fixed menu">
      <Link className="item" to={ROUTES.LANDING}>
        <img alt = "logo" src={logoSrc} />
      </Link>
      <Link className="item right floated" to={ROUTES.SIGN_IN}>Sign In</Link>


    </div>

  </div>

);

export default Navigation;