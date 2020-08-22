import React from 'react';

import { AuthUserContext, withAuthorization } from './Session';

const GraphView = () => {

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>Graph View</div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(GraphView);