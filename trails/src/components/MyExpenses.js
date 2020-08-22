import React, { useState } from 'react';
import MonthView from "./MonthView";
import GraphView from "./GraphView";
import RecentView from "./RecentView";
import './MyExpenses.css';

const MyExpenses = () => {
    const [view, setView] = useState("recent");

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
    )
}

export default MyExpenses;