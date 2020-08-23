import React from 'react';

import { withAuthorization } from '../Session';

const HomePage = () => (
  <div>
    <h1 style={{ "fontSize": "64px" }}>Receipt Trail</h1>
    <p style={{ "fontSize": "42px" }}>The new home for all your receipts.</p>
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);