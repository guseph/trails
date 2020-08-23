import React from 'react';

import { AuthUserContext, withAuthorization } from './Session';

const Receipt = (props) => {
  const getDateObject = () => {
    if (props.receipt.receiptDate) return new Date(props.receipt.receiptDate * 1000);
    return null
  }
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div class="card">
                  <div class="image">
                    <img style={{ "width": "200px", "height": "200px", "margin-left": "auto", "margin-right": "auto" }} src={props.receipt.receiptPhotoUrl || ''} />
                  </div>
                  <div class="content">
                    <div class="description">
                      <b>Total: </b>{props.receipt.total || 0}
                    </div>
                    <div class="description">
                      <b>Tax: </b>{props.receipt.tax || 0}
                    </div>
                  </div>
                  <div class="extra content">
                    <span>
                      {(getDateObject() === null ? '??/??/????' : `${getDateObject().getMonth() + 1}/${getDateObject().getDate()}/${getDateObject().getFullYear()}`)}
                    </span>
                  </div>
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Receipt);