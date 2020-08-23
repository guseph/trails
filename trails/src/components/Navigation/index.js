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

const logoSrc = "https://img.freepik.com/free-vector/a4-paper-mockup_1017-7639.jpg?size=338&ext=jpg";

const NavigationAuth = () => (
  <div>
    <div className="ui top fixed menu">
      <Link className="item" to={ROUTES.HOME}>
        <img alt = "logo" src={logoSrc} />
      </Link>

      <Link className="item" to={ROUTES.HOME}>Home</Link>
      <Link className="item" to={ROUTES.MY_EXPENSES}>Expenses</Link>
      <Link className="item" to={ROUTES.ADD_RECEIPT}>Add Receipt</Link>
      <Link className="item" to={ROUTES.ACCOUNT}>Account</Link>
     
      <SignOutButton />

    </div>

  </div>

);

const NavigationNonAuth = () => (
  <div>
    <div className="ui top fixed menu">
      <Link className="item" to={ROUTES.HOME}>
        <img alt = "logo" src={logoSrc} />
      </Link>
      <Link className="item right floated" to={ROUTES.SIGN_IN}>Sign In</Link>


    </div>

  </div>

);

export default Navigation;