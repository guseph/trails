import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { AuthUserContext, withAuthorization } from './Session';
import Receipt from './Receipt';

import * as FIRESTOREPATHS from '../constants/firestorePaths'

const RecentView = (props) => {
    const [loading, setLoading] = useState(true);
    const [userReceipts, setUserReceipts] = useState(null);

    const loadingView = (
        <div>
            LOADING RECEIPTS...
        </div>
    )

    useEffect(() => {
        const fetchData = async () => {
            const getAllReceiptsRes = await axios({
                method: 'get',
                url: `http://localhost:5001/trails-bb944/us-central1/app/api/${props.firebase.getCurrentUserId()}/userReceipts`, // upload route URL
            });
            setUserReceipts(getAllReceiptsRes.data);
            setLoading(false);
        }
        fetchData();
      }, []);

    const refreshReceipts = async () => {
        setLoading(true);
        const getAllReceiptsRes = await axios({
            method: 'get',
            url: `http://localhost:5001/trails-bb944/us-central1/app/api/${props.firebase.getCurrentUserId()}/userReceipts`, // upload route URL
        });
        setUserReceipts(getAllReceiptsRes.data);
        setLoading(false);
    }

    const receipts = () => {
        if (userReceipts && userReceipts.length !== 0) {
            return userReceipts.map((receipt) => {
                return (<Receipt receipt={receipt} key={receipt.id} onReceiptRefresh={refreshReceipts}/>);
            })
        } else {
            return (<h2>No receipts!</h2>);
        }
    }

    const spinner = (
        <div className="ui active inverted dimmer">
            <div className="ui text loader">Loading</div>
        </div>
    )

    return (
        <div className="ui cards">
            {loading ? loadingView : receipts() }
            {loading && spinner}
        </div>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(RecentView);