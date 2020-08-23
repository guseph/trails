import React, { useState } from 'react';
import axios from 'axios';
import { AuthUserContext, withAuthorization } from './Session';
import "./AddReceipt.css";

import * as FIRESTOREPATHS from '../constants/firestorePaths'

const AddReceipt = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState(null);

    const onFileSelected = (e) => {
        if (e.target.files[0]){
            setSelectedFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    }

    const onFileUpload = async (e) => {
        e.preventDefault();
        try{
            if (selectedFile !== ''){
                const userId = props.firebase.getCurrentUser().uid;

                let fileData = new FormData();
                fileData.append('receipt', selectedFile);
                const uploadReceiptRes = await axios({
                    method: 'post',
                    url: `http://localhost:5001/trails-bb944/us-central1/app/uploads/receipt/${userId}/${Date.now()}-${encodeURIComponent(selectedFile.name)}`, // upload route URL
                    data: fileData,
                    headers: {'Content-Type': 'multipart/form-data'}
                });

                // add receipt doc in Firestore
                const receiptDoc = await props.firebase.addDoc(FIRESTOREPATHS.USER_RECEIPTS_COL_PATH(userId), {
                    receiptPhotoUrl: uploadReceiptRes.data.fileUrl,
                    receiptUploadDate: Date.now(),
                    gsUrl: uploadReceiptRes.data.gsUrl
                });

                // pass gsUrl to Vision API
                const receiptProperties = await axios({
                    method: 'post',
                    url: `http://localhost:5001/trails-bb944/us-central1/app/tester`,
                    data: {
                        gsUrl: uploadReceiptRes.data.gsUrl,
                    }
                });

                await props.firebase.setDoc(FIRESTOREPATHS.USER_RECEIPT_DOC_PATH(userId, receiptDoc.id), receiptProperties.data);
            }
        } catch (error){
            console.log(`error: ${error}`)
        }
        
    }
    
    return (
        <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <h1>Add Receipt</h1>
                <h3>Select Receipt</h3>
                <form id = "file-form" className = "ui form" onSubmit = {(e) => onFileUpload(e)} encType="multipart/form-data">
                    <input className = "field" type = 'file' onChange={onFileSelected} />
                    <button id = "upload-btn" type = 'submit' className = "ui button">Upload Receipt</button>
                </form>
            </div>
        )}
      </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AddReceipt);
