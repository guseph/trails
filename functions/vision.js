require('dotenv').config({path: './.env'})

const vision = require('@google-cloud/vision');
const credentials = require(process.env.GCLOUD_APPLICATION_CREDENTIALS);
const client = new vision.ImageAnnotatorClient({credentials});
//const bucketName = process.env.REACT_APP_STORAGE_BUCKET;

// Given link to firebase storage, get data from vision API and parse
const parseReceipt = async (imgStorageUrl) => {
    try{
        if(!imgStorageUrl){
            throw new Error("No image url given");
        }

        // make request to vision API
        const fileName = imgStorageUrl; 
        const [result] = await client.textDetection("https://firebasestorage.googleapis.com/v0/b/trails-bb944.appspot.com/o/philly.jpg?alt=media");
        const detections = result.textAnnotations;
        console.log('Text:');
        detections.forEach(text => console.log(text));


    } catch (e) {
        console.log(e);
    }
}

module.exports = parseReceipt; 