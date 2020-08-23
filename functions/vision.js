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
        const total = getTotal(detections)
        parsedData["total"] = total;

        // can add parsing for individual items later, or the location etc. 


        // just return total for now 
        return parsedData;


    } catch (e) {
        return e
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
    const keywords = ["Due", "Total", "BALANCE", "total"]

    // filter out possible prices and "total" keywords
    // stores in arrays as {text: value, topy: coord1, boty: coord2} object! 
    data.forEach((text) => {
        const description = text.description; 
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
    const total = findPriceMatches(prices, totalLocation)
    console.log(total)

    return total;
}

// find the associated price (float)
const findPriceMatches = (prices, totalLocation) => {
    // estimate y coordinates of the row with the total
    const offset = 50; // because row coordinates may vary (can change this)
    let rowTop = totalLocation[0].topY - offset
    let rowBot = totalLocation[0]["botY"] + offset

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



module.exports = parseReceipt; 