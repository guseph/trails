import React from 'react';

import { AuthUserContext, withAuthorization } from './Session';

const ConfirmExpense = () => {
    return(
        <AuthUserContext.Consumer>
            {authUser => (
                <div>Confirm Expense here</div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ConfirmExpense);