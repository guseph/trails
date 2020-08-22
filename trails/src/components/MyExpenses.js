import React, {useState} from 'react';
import MonthView from "./MonthView";
import GraphView from "./GraphView";
import RecentView from "./RecentView";

const MyExpenses = () => {
    const [view, setView] = useState("recent");

    // render correct view 
    const currentView = () => {
        if(view === "recent"){
            return <RecentView />
        }
        else if (view === "graph"){
            return <GraphView />
        }
        else{
            return <MonthView />
        }
    }


    return (
        <div>
            <button onClick = {() => setView("recent")}>Recent</button>
            <button onClick = {() => setView("graph")}>Graph</button>
            <button onClick = {() => setView("month")}>Month</button>

            {currentView()}
        </div>
    )
}

export default MyExpenses;