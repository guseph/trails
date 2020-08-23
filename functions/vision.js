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
        const [result] = await client.textDetection(imgStorageUrl);
        const detections = result.textAnnotations;
        // console.log('Text:');
        //console.log(detections[0]["description"])

        let parsedData = {}
        
        // use vision data to get pieces
        const total = await getTotal(detections);
        if (!isNaN(total)) parsedData["total"] = total;

        const receiptDate = await getReceiptDate(detections);
        if (receiptDate) {
            const unixDate = new Date(parseInt(( receiptDate[2].length === 2 ? '20' + receiptDate[2] : receiptDate[2] ), 10), parseInt(receiptDate[0], 10) - 1, parseInt(receiptDate[1], 10));
            const unixSeconds = unixDate.getTime() / 1000;
            parsedData["receiptDate"] = unixSeconds;
        }

        // const receiptTime = getReceiptTime(detections);
        // parsedData["receiptTime"] = receiptTime;

        // const tax;

        // const discountSales;

        // const phoneNumber;

        // const address;

        // const totalItemsSold;

        // can add parsing for individual items later, or the location etc. 


        // just return total for now 
        console.log(parsedData);
        return parsedData;


    } catch (e) {
        console.log(e);
        return e;
    }
}

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

// filter for the y value verticies (top and bottom?)
const getTotal = (data) => {
    //var data = require('./test.json');
    var prices = [] // all numbers 
    var totalLocation = [] // possible coordinates of rows where the total could be

    // Keywords that indicate totals! 
    // Can add more to this! 
    const keywords = ["due", "total", "balance", "amount", "order", "purchase"]

    // filter out possible prices and "total" keywords
    // stores in arrays as {text: value, topy: coord1, boty: coord2} object! 
    data.forEach((text) => {
        const description = text.description.toLowerCase(); 
        if (isNumber(description) || description[0] === "$"){
            const topY = text["boundingPoly"]["vertices"][0]["y"] 
            const botY = text["boundingPoly"]["vertices"][3]["y"] 
            prices.push({"text":description, "topY": topY, "botY": botY})
        }
        else if (keywords.includes(description)){
            const topY = text["boundingPoly"]["vertices"][0]["y"] 
            const botY = text["boundingPoly"]["vertices"][3]["y"] 
            totalLocation.push({"text":description, "topY": topY, "botY": botY})
        }
    })
    // console.log("Prices" + prices)
    // console.log("target:" + totalLocation)

    // Find the price on the row with the total
    if (totalLocation.length === 0 || prices.length === 0) {
        return NaN
    }
    const total = findPriceMatches(prices, totalLocation)
    console.log(total)

    return total;
}

// find the associated price (float)
const findPriceMatches = (prices, totalLocation) => {
    // estimate y coordinates of the row with the total
    const offset = 50; // because row coordinates may vary (can change this)
    let rowBot = totalLocation[0]["botY"] + offset
    let rowTop = totalLocation[0]["topY"] - offset

    // find price(s) in that row!
    let matches = []
    prices.forEach((price) => {
        if (price.topY > rowTop && price.botY < rowBot){
            matches.push(price);
        }
    })
    // console.log("matches");
    // console.log(matches);

    // can add something later, if there is more than one match! 
    if (matches.length === 0){
        return null
    }

    let match = matches[0].text;
    // get rid of $ if there is one
    if (match[0] === "$"){
        match = match.substring(1);
    }
    return parseFloat(match);
}

function isNumberDate(n) { return n.match(/^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(\d{4}|\d{2})$/); }

const getReceiptDate = (data) => {
    var dates = [] // all potential dates 

    // filter out possible dates
    data.forEach((text) => {
        const description = text.description;
        const potentialMatches = isNumberDate(description);
        if (potentialMatches !== null){
            dates.push(potentialMatches.slice(1,4));
        }
    })

    console.log(dates)

    return dates[0];
}



module.exports = parseReceipt; 