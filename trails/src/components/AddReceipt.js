import React, { useState } from 'react';
import axios from 'axios';
import { AuthUserContext, withAuthorization } from './Session';
import ConfirmExpense from "./ConfirmExpense";
import "./AddReceipt.css";


import * as FIRESTOREPATHS from '../constants/firestorePaths'

const AddReceipt = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [fileName, setFileName] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [total, setTotal] = useState(null);
    const [receiptDate, setReceiptDate] = useState(null);
    const [receiptDocId, setReceiptDocId] = useState(null);

    const onFileSelected = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            // setFileName(e.target.files[0].name);
        }
    }

    const onFileUpload = async (e) => {
        e.preventDefault();
        try {

            if (selectedFile !== '') {
                const userId = props.firebase.getCurrentUser().uid;

                let fileData = new FormData();
                fileData.append('receipt', selectedFile);
                setLoading(true)
                const uploadReceiptRes = await axios({
                    method: 'post',
                    url: `http://localhost:5001/trails-bb944/us-central1/app/uploads/receipt/${userId}/${Date.now()}-${encodeURIComponent(selectedFile.name)}`, // upload route URL
                    data: fileData,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // add receipt doc in Firestore
                const receiptDoc = await props.firebase.addDoc(FIRESTOREPATHS.USER_RECEIPTS_COL_PATH(userId), {
                    receiptPhotoUrl: uploadReceiptRes.data.fileUrl,
                    receiptUploadDate: Date.now(),
                    gsUrl: uploadReceiptRes.data.gsUrl
                });
                setLoading(false);

                setReceiptDocId(receiptDoc.id);

                // pass gsUrl to Vision API
                const receiptProperties = await axios({
                    method: 'post',
                    url: `http://localhost:5001/trails-bb944/us-central1/app/tester`,
                    data: {
                        gsUrl: uploadReceiptRes.data.gsUrl,
                    }
                });

                setReceiptDate(receiptProperties.data.receiptDate);
                setTotal(receiptProperties.data.total);

                setConfirm(true);
            }
        } catch (error) {
            console.log(`error: ${error}`)
        }

    }

    // save expense data to firebase
    const addExpense = async () => {
        console.log("added expense");
        await props.firebase.setDoc(FIRESTOREPATHS.USER_RECEIPT_DOC_PATH(props.firebase.getCurrentUser().uid, receiptDocId), {
            total,
            receiptDate
        });
        setConfirm(false);
        alert('succ');
    }

    const back = async () => {
        // reset state
        setConfirm(false);
        setTotal(null);
        setReceiptDate(null);
        await props.firebase.deleteDoc(FIRESTOREPATHS.USER_RECEIPT_DOC_PATH(props.firebase.getCurrentUser().uid, receiptDocId))
        setReceiptDocId(null);
    }


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

    const confirmForm = (
        <div>
            <h1>Generated Expense Report</h1>
            <hr />
            <form id = "confirm-form" class="ui form">
                    <div className = "row">
                        <div className = "inline fields">
                            <label>Total</label>
                            <div className="field">
                                <input type="number" name="total" value={total} onChange={(e) => setTotal(e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "inline fields">
                            <label>Date</label>
                            <div className="field">
                                <input type="date" name="date" value={unixToInputVal(receiptDate)} onChange={(e) => setReceiptDate(inputValToUnix(e.target.value))}></input>
                            </div>
                        </div>

                    </div>
                


            </form>
    
            {/* <input type = "text" value = {total} onChange = {(e) => setTotal(e.target.value)}></input> */}
            {/* <h4>Total: {total}</h4> */}
            {/* <h4>Date: {new Date(receiptDate * 1000).toDateString()}</h4> */}
            <button className="ui button green" onClick={() => addExpense()}>Confirm Expense</button>
            <button className="ui button red" onClick={back}>Back</button>
        </div>
    )

    const uploadForm = (
        <div>
            <h1>Add Receipt</h1>
            <form id="file-form" className="ui form" onSubmit={(e) => onFileUpload(e)} encType="multipart/form-data">
                <input className="field" type='file' onChange={onFileSelected} />
                <button id="upload-btn" type='submit' className="ui button">Upload Receipt</button>
            </form>
        </div>
    )

    const spinner = (
        <div class="ui active inverted dimmer">
            <div class="ui text loader">Loading</div>
        </div>
    )

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    {/* {confirm ? confirmForm : uploadForm} */}
                    {confirmForm}
                    {loading && spinner}
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AddReceipt);
