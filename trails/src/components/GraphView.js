import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'tui-chart/dist/tui-chart.css'
import {PieChart} from '@toast-ui/react-chart'
import MonthBarGraph from "./MonthBarGraph";

import { AuthUserContext, withAuthorization } from './Session';

const GraphView = (props) => {
    const [loading, setLoading] = useState(true);
    const [yearStats, setYearStats] = useState({});
    const [currentYear, setCurrentYear] = useState(2020);

    useEffect(() => {
        const fetchData = async () => {
            const yearStatsRes = await axios({
                method: 'get',
                url: `http://localhost:5001/trails-bb944/us-central1/app/api/${props.firebase.getCurrentUserId()}/userReceipts/${currentYear}/yearStats`, // upload route URL
            });
            setYearStats(yearStatsRes.data);
            setLoading(false);
        }
        fetchData();
    }, []);
    // move this to separate component later
    const barDataTotalTax = {
        categories: ["money"], 
        series: [
            {
                name: "Total", 
                data: yearStats[0]
            }, 
            {
                name: "Tax", 
                data: yearStats[1]
            }
        ]
    }

    const options = {
        chart: {
            width: 660,
            height: 560,
            title: 'Total versus Tax'
        },
        tooltip: {
            suffix: '%'
        }
    }

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <h1>2020 Graphs</h1>
                    {loading ? <h3>LOADING...</h3> : <PieChart data = {barDataTotalTax} options = {options}/>}
                    <MonthBarGraph />
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(GraphView);