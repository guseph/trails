import React, { useState, useEffect } from 'react';

import { withAuthorization } from './Session';
import * as FIRESTOREPATHS from '../constants/firestorePaths'

const Receipt = (props) => {
  const [confirm, setConfirm] = useState(false);
    const [tax, setTax] = useState(null);
    const [total, setTotal] = useState(null);
    const [receiptDate, setReceiptDate] = useState(null);
    const [deleteReceipt, setDeleteReceipt] = useState(false);

  const getDateObject = () => {
    if (props.receipt.receiptDate) return new Date(props.receipt.receiptDate * 1000);
    return null
  }

  useEffect(() => {
    setTax(props.receipt.tax || 0)
    setTotal(props.receipt.total || 0)
    setReceiptDate(props.receipt.receiptDate || new Date().getTime() / 1000)
  }, []);

  const unixToInputVal = (unix) => {
    let date = new Date(unix * 1000)
    var month = (date.getMonth() + 1);               
    var day = date.getDate();
    if (month < 10) 
        month = "0" + month;
    if (day < 10) 
        day = "0" + day;
    var val = date.getFullYear() + '-' + month + '-' + day;
    return val
  }

  const inputValToUnix = (val) => {
      console.log(val);
      var b = val.split(/\D/);
      let date =  new Date(b[0], --b[1], b[2]);
      const unixSeconds = date.getTime() / 1000;
      return unixSeconds;
  }
  const back = async () => {
    // reset state
    setConfirm(false);
    setDeleteReceipt(false);
    setTotal(null);
    setReceiptDate(null);
    setTax(null);
}

  const confirmForm = (
    <div>
        <h1>Generated Expense Report</h1>
        <hr />
        <form id = "confirm-form" className="ui form">
                <div className = "row">
                    <div className = "inline fields">
                        <label>Date</label>
                        <div className="field">
                            <input type="date" name="date" value={unixToInputVal(receiptDate)} onChange={(e) => setReceiptDate(inputValToUnix(e.target.value))}></input>
                        </div>
                    </div>

                </div>
                <div className = "row">
                    <div className = "inline fields">
                        <label>Tax</label>
                        <div className="field">
                            <input type="number"  name="tax" value={tax || 0} onChange={(e) => setTax(parseFloat(e.target.value))}></input>
                        </div>
                    </div>
                </div>
                <div className = "row">
                    <div className = "inline fields">
                        <label>Total</label>
                        <div className="field">
                        <input type="number" name="total" value={total || 0} onChange={(e) => setTotal(parseFloat(e.target.value))}></input>
                        </div>
                    </div>
                </div>
            


        </form>

        <button className="ui button green" onClick={() => addExpense()}>Confirm Changes</button>
        <button className="ui button red" onClick={back}>Back</button>
    </div>
  )

  const addExpense = async () => {
    await props.firebase.setDoc(FIRESTOREPATHS.USER_RECEIPT_DOC_PATH(props.firebase.getCurrentUserId(), props.receipt.id), {
        total,
        receiptDate,
        tax
    });
    props.onReceiptRefresh();
    setConfirm(false);
    setDeleteReceipt(false);
}

  const openEdit = () => {
    setConfirm(true);
  }
  
  const openDelete = () => {
    setDeleteReceipt(true);
  }

  const deleteReceiptProcess = async () => {
    await props.firebase.deleteDoc(FIRESTOREPATHS.USER_RECEIPT_DOC_PATH(props.firebase.getCurrentUserId(), props.receipt.id));
    props.onReceiptRefresh();
  }

  const deleteReceiptForm = (
    <div>
      <h2>Delete this receipt?</h2>
      <button className="ui button" onClick={back}>NO</button>
      <button className="ui red button" onClick={deleteReceiptProcess}>YES</button>
    </div>
  )

    const regularReceipt = (
      <div>
      <div className="image">
        <img style={{ "width": "200px", "height": "200px", "marginLeft": "auto", "marginRight": "auto" }} src={props.receipt.receiptPhotoUrl || ''} alt="Your receipt." />
      </div>
      <div className="content">
        <div className="description">
          <b>Total: </b>{props.receipt.total || '?'}
        </div>
        <div className="description">
          <b>Tax: </b>{props.receipt.tax || '?'}
        </div>
      </div>
      <div className="extra content">
        <span className="right floated">
          <button className="ui red button" onClick={openDelete}>Delete</button>
        </span>
        <span className="right floated">
          <button className="ui button" onClick={openEdit}>Edit</button>
        </span>
        <span>
          {(getDateObject() === null ? '??/??/????' : `${getDateObject().getMonth() + 1}/${getDateObject().getDate()}/${getDateObject().getFullYear()}`)}
        </span>
      </div>
      </div>
    )
    return (
      <div className="card">
        {confirm ? confirmForm : ( deleteReceipt ? deleteReceiptForm : regularReceipt)}
      </div>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Receipt);