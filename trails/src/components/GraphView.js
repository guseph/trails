import React from 'react';
import 'tui-chart/dist/tui-chart.css'
import {PieChart} from '@toast-ui/react-chart'
import MonthBarGraph from "./MonthBarGraph";

import { AuthUserContext, withAuthorization } from './Session';

const GraphView = () => {

    // move this to separate component later
    const barDataTotalTax = {
        categories: ["money"], 
        series: [
            {
                name: "Total", 
                data: 19.99
            }, 
            {
                name: "Tax", 
                data: 3.00
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
                    <h1>Graph View</h1>
                    <PieChart data = {barDataTotalTax} options = {options}/>
                    <MonthBarGraph />
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(GraphView);