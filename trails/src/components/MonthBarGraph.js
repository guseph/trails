import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'tui-chart/dist/tui-chart.css'
import { BarChart } from '@toast-ui/react-chart'

import { AuthUserContext, withAuthorization } from './Session';

const MonthBarGraph = (props) => {
    const [loading, setLoading] = useState(true);
    // const [monthlySpendings, setMonthlySpendings] = useState({});
    const [currentYear, setCurrentYear] = useState(2020);

    useEffect(() => {
        const fetchData = async () => {
            // const monthlySpendingsRes = await axios({
            //     method: 'get',
            //     url: `http://localhost:5001/trails-bb944/us-central1/app/api/${props.firebase.getCurrentUserId()}/userReceipts/${currentYear}/monthlySpendings`, // upload route URL
            // });
            // setMonthlySpendings(monthlySpendingsRes.data);
            setLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // const monthlySpendingsRes = await axios({
            //     method: 'get',
            //     url: `http://localhost:5001/trails-bb944/us-central1/app/api/${props.firebase.getCurrentUserId()}/userReceipts/${currentYear}/monthlySpendings`, // upload route URL
            // });
            // setMonthlySpendings(monthlySpendingsRes.data);
            setLoading(false);
        }
        fetchData();
    }, [currentYear]);

    let data = {
        categories: ['Jan', 'Feb', 'March', "April", "May", 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            {
                name: 'Expenses',
                data: props.monthlySpendings,
            }
        ]
    }

    const options = {
        chart: {
            width: 1160,
            height: 650,
            title: 'Monthly Spending',
            format: '1,000'
        },
        yAxis: {
            title: 'Month'
        },
        xAxis: {
            title: 'Amount',
            min: 0,
            max: Math.max.apply(null, props.monthlySpendings) + 200,
            suffix: '$'
        },
        series: {
            showLabel: true
        }
    }


    return (
        <div>
            {loading ? <h3>LOADING...</h3> : <BarChart data = {data} options = {options} />}
        </div>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MonthBarGraph);