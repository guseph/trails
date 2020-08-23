// set up router
const express = require('express');
const router = express.Router();
require('dotenv').config({path: './.env'})

const {Storage} = require('@google-cloud/storage');

const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

// set up Storage instance with credentials
const storage = new Storage({
    projectId: process.env.REACT_APP_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
});

// create a bucket
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL)

// route for users to upload images
    // will store in Fire base
router.post('/receipt/:userId/:photoName', async (req, res) => {
    const userId = req.params.userId;
    const photoName = req.params.photoName;

    const busboy = new Busboy({
        headers: req.headers
    });
    const tmpdir = os.tmpdir();

    // This object will accumulate all the fields, keyed by their name
    const fields = {};
    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {};
    // This code will process each non-file field in the form.
    busboy.on('field', (fieldname, val) => {
    // TODO(developer): Process submitted field values here
        console.log(`Processed field ${fieldname}: ${val}.`);
        fields[fieldname] = val;
    });
    const fileWrites = [];
    // This code will process each file uploaded.
    busboy.on('file', (fieldname, file, filename) => {
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        console.log(`Processed file ${filename}`);
        const filepath = path.join(tmpdir, filename);
        uploads[fieldname] = filepath;
        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);
        // File was processed by Busboy; wait for it to be written to disk.
        const promise = new Promise((resolve, reject) => {
            file.on('end', () => {
                writeStream.end();
            });
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on('finish', () => {
    Promise.all(fileWrites).then(() => {
        for (const name in uploads) {
            const file = uploads[name];
            let data = fs.readFileSync(uploads[name]);
            const filetoGCF = bucket.file(`${userId}/${photoName}`);
            filetoGCF.save(data)
                .then(success => {
                    res.json({
                        uploaded: true,
                        created_at: new Date().getTime(),
                        filename: `${photoName}`,
                        filePath: `${userId}/${photoName}`,
                        fileUrl: `https://firebasestorage.googleapis.com/v0/b/trails-bb944.appspot.com/o/${userId}%2F${photoName}?alt=media`,
                        gsUrl: `gs://trails-bb944.appspot.com/${userId}/${photoName}`
                    });
                    return null;
                }).catch((err) => {
                    res.json({
                        uploaded: false,
                        error: err,
                    })
                })
            fs.unlinkSync(file);
        }
        return null;
    }).catch((err)=>{
        res.json({
            uploaded: false,
            error: err,
        });
    });
    });

    busboy.end(req.rawBody);
})

module.exports = router;