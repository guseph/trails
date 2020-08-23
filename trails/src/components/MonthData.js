import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { AuthUserContext, withAuthorization } from './Session';
import * as FIRESTOREPATHS from '../constants/firestorePaths'

const MonthData = (props) => {
  const [confirm, setConfirm] = useState(false);
    const [tax, setTax] = useState(null);
    const [total, setTotal] = useState(null);
    const [receiptDate, setReceiptDate] = useState(null);
    const [deleteReceipt, setDeleteReceipt] = useState(false);

  const monthName = () => {
    switch (props.month.currentMonth) {
      case 0: return 'January'
      case 1: return 'February'
      case 2: return 'March'
      case 3: return 'April'
      case 4: return 'May'
      case 5: return 'June'
      case 6: return 'July'
      case 7: return 'August'
      case 8: return 'September'
      case 9: return 'October'
      case 10: return 'November'
      case 11: return 'December'
      default: return null;
    }
  }

    return (
      <div className="ui card">
        <div className="content">
          <div className="header">{monthName()}</div>
          <div className="meta">{props.month.currentYear}</div>
          <div className="description">
            <p><b>Total: </b>{props.month.data[0]}</p>
            <p><b>Tax: </b>{props.month.data[1]}</p>
            <p><b>Number of Receipts: </b>{props.month.data[2]}</p>
          </div>
        </div>
      </div>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MonthData);