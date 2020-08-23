import React, { useState } from 'react';
import MonthView from "./MonthView";
import GraphView from "./GraphView";
import RecentView from "./RecentView";
import './MyExpenses.css';

import { AuthUserContext, withAuthorization } from './Session';

const MyExpenses = () => {
    const [view, setView] = useState("graph");

    // render correct view 
    const currentView = () => {
        if (view === "recent") {
            return <RecentView />
        }
        else if (view === "graph") {
            return <GraphView />
        }
        else {
            return <MonthView />
        }
    }


    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <div className="ui buttons">
                        <button className = "large ui button" onClick={() => setView("graph")}>Graph</button>
                        <button className = "large ui button" onClick={() => setView("recent")}>Recent</button>
                        <button className = "large ui button" onClick={() => setView("month")}>Month</button>
                    </div>
                    <div className = "ui container" id = "view-panel">
                        {currentView()}
                    </div>

                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MyExpenses);