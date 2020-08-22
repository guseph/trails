// set up router
const multer = require('multer')
const express = require('express');
const router = express.Router();
require('dotenv').config({path: './.env'})

const {Storage} = require('@google-cloud/storage');

// set up Storage instance with credentials
const storage = new Storage({
    projectId: process.env.REACT_APP_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
});

// create a bucket
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL)

// multer instance
// allows us to access the uploaded file sent over in the body
// use memory storage engine provided by Multer so we can make a Buffer obj
    // by adding this, req.file will contain a field called buffer which contains the entire file
const upload = multer({
    storage: multer.memoryStorage(), 
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload a jpg, jpeg, or png file"))
        }
        cb(undefined, true);
    }
})

// route for users to upload images
    // will store in Fire base
router.post('/receipt', upload.single('receipt'), async (req, res, next) => {
    console.log("receieved");
        // Need an indicator of which user is currently authenticated
        // Save the image: req.file.buffer to Firebase Storage! 

    try{
        if (!req.file){
            return res.status(400).send('not file uploaded.');
        }
        // upload file to cloud storage
        const blob = bucket.file(req.file.originalname);
        // create a writable stream that we can check for events
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype, 
            }
        });
        // handle error
        blobStream.on('error', (err) => next(err));

        // on success
        blobStream.on('finish', () => {
            // create the file public URL
            // TODO: ADD USER ID FOLDER TO PATH??? 
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
            
            // Return the file name and it's public URL for you to store in your database
            res.status(200).send({
                fileName: req.file.originalname, 
                fileLocation: publicUrl
            });
        
        })

        // Handle when no more data to be confused
        blobStream.end(req.file.buffer);

    } catch (error){
        res.status(400).send(`Error, could no upload file:  ${error}`)
    }

})

module.exports = router;