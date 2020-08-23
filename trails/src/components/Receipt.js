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
                // <div>
                //     <h2>{props.receipt.total}</h2>
                //     <h2>{props.receipt.receiptDate}</h2>
                // </div>
                <div class="card">
                  <div class="image">
                    <img style={{ "width": "200px", "height": "200px" }} src={props.receipt.receiptPhotoUrl || ''} />
                  </div>
                  <div class="content">
                    {/* <div class="header">Matt Giampietro</div> */}
                    {/* <div class="meta">
                      <a>Friends</a>
                    </div> */}
                    <div class="description">
                      <h4><b>Total: </b>{props.receipt.total || 0}</h4>
                      {/* <h4><b>Date: </b>{props.receipt.receiptDate || }</h4> */}
                    </div>
                  </div>
                  <div class="extra content">
                    {/* <span class="right floated">
                      Joined in 2013
                    </span> */}
                    <span>
                      {/* <i class="user icon"></i> */}
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