import React from 'react';

import { AuthUserContext, withAuthorization } from './Session';

const MonthView = () => {

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    Month View here
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MonthView);