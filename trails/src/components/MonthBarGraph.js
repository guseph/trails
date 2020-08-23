import React from 'react';
import 'tui-chart/dist/tui-chart.css'
import { BarChart } from '@toast-ui/react-chart'

const MonthBarGraph = () => {
    const data = {
        categories: ['Jan', 'Feb', 'March', "April", "May", 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            {
                name: 'Expenses',
                data: [5000, 3000, 5000, 7000, 6000, 4000]
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
            max: 9000,
            suffix: '$'
        },
        series: {
            showLabel: true
        }
    }


    return (
        <BarChart data = {data} options = {options} />
    )
}

export default MonthBarGraph;