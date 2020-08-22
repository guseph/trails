import React from 'react';

import { AuthUserContext, withAuthorization } from './Session';

const RecentView = () => {

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>Recent View Here</div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(RecentView);