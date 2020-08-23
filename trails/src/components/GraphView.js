import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'tui-chart/dist/tui-chart.css'
import {PieChart} from '@toast-ui/react-chart'
import MonthBarGraph from "./MonthBarGraph";

import { AuthUserContext, withAuthorization } from './Session';

const GraphView = (props) => {
    const [loading, setLoading] = useState(true);
    const [yearStats, setYearStats] = useState({});
    const [monthlySpendings, setMonthlySpendings] = useState({});
    const [currentYear, setCurrentYear] = useState(2020);

    useEffect(() => {
        const fetchData = async () => {
            const yearStatsRes = await axios({
                method: 'get',
                url: `http://localhost:5001/trails-bb944/us-central1/app/api/${props.firebase.getCurrentUserId()}/userReceipts/${currentYear}/yearStats`, // upload route URL
            });
            setYearStats(yearStatsRes.data);

            const monthlySpendingsRes = await axios({
                method: 'get',
                url: `http://localhost:5001/trails-bb944/us-central1/app/api/${props.firebase.getCurrentUserId()}/userReceipts/${currentYear}/monthlySpendings`, // upload route URL
            });
            setMonthlySpendings(monthlySpendingsRes.data);
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
    const spinner = (
        <div className="ui active inverted dimmer">
            <div className="ui text loader">Loading</div>
        </div>
    )

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <h1>2020 Graphs</h1>
                    {loading ? <h3>LOADING...</h3> : <PieChart data = {barDataTotalTax} options = {options}/>}
                    {loading ? <h3>LOADING...</h3> : <MonthBarGraph monthlySpendings={monthlySpendings} />}
                    {loading && spinner}
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(GraphView);