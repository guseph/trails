import React, { useState } from 'react';
import axios from 'axios';
import "./AddReceipt.css";

const AddReceipt = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState(null);

    const onFileSelected = (e) => {
        if (e.target.files[0]){
            setSelectedFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    }

    const onFileUpload = async (e) => {
        // e.preventDefault();
        // try{
        //     if (selectedFile !== ''){
        //         let fileData = new FormData();
        //         // add timestamp to upload in case user uploads same image multiple times
        //         fileData.set('receipt', selectedFile, `${Date.now()}-${selectedFile.name}`);
        //         await axios({
        //             method: 'post', 
        //             url: "", // upload route URL
        //             data: fileData,
        //             headers: {'Content-Type': 'multipart/form-data'}
        //         });
        //     }
           
        // } catch (error){
        //     console.log(`error: ${error}`)
        // }
       console.log("file upload yee!");
        
    }
    
    return (
        <div>
            <h1>Add Receipt</h1>
            <h3>Select Receipt</h3>
            <form id = "file-form" className = "ui form" onSubmit = {(e) => onFileUpload(e)}>
                <input className = "field" type = 'file' onChange={onFileSelected} />
                <button id = "upload-btn" type = 'submit' className = "ui button">Upload Receipt</button>
            </form>            

        </div>
    )
}

export default AddReceipt;