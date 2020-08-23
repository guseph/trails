import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { AuthUserContext, withAuthorization } from './Session';
import MonthData from './MonthData'

const MonthView = (props) => {
    const [loading, setLoading] = useState(true);
    // const [oldestReceipt, setOldestReceipt] = useState(null);
    const [months, setMonths] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            // const oldestReceiptRes = await axios({
            //     method: 'get',
            //     url: `http://localhost:5001/trails-bb944/us-central1/app/api/${props.firebase.getCurrentUserId()}/userReceipts/oldReceipt`, // upload route URL
            // });
            // setOldestReceipt(oldestReceiptRes.data);

            // const oldestRecieptDate = new Date(oldestReceipt.receiptDate)
            // const oldestMonth = oldestRecieptDate.getMonth()
            // const oldestYear = oldestReceiptDate.getFullYear()
            let monthsTemp = [];

            const currentDate = new Date()
            let currentMonth = currentDate.getMonth()
            let currentYear = currentDate.getFullYear()

            let counter = 0;

            while (counter < 6) {
                const monthStatsRes = await axios({
                    method: 'get',
                    url: `http://localhost:5001/trails-bb944/us-central1/app/api/${props.firebase.getCurrentUserId()}/userReceipts/${currentYear}/${currentMonth}/monthStats`, // upload route URL
                });
                monthsTemp.push({
                    currentMonth,
                    currentYear,
                    data: monthStatsRes.data  // [0]: total, [1]: tax, [2]: # receipts
                })
                counter++;
                if (currentMonth === 1) {
                    currentMonth = 12
                    currentYear--
                } else currentMonth--
            }
            setMonths(monthsTemp)
            setLoading(false);
        }
        fetchData();
      }, []);

      const generatedMonths = () => {
        if (months && months.length !== 0) {
            return months.map((month) => {
                return (<MonthData month={month} key={(month.currentMonth.toString() + month.currentYear.toString())}/>);
            })
        } else {
            return (<h2>No months!</h2>);
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
                    <h2>Your Last 6 Months</h2>
                    {loading ? <h3>LOADING...</h3> : generatedMonths()}
                    {loading && spinner}
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MonthView);