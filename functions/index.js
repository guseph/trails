
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const uploads = require('./uploads.js');
const vision = require('./vision.js');

require('dotenv').config({ path: './.env' })

app.use(cors({ origin: true }));

// connect other routers
app.use('/uploads', uploads) // to call these routes, you prepend /uploads to use that file's router

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://trails-bb944.firebaseio.com"
});
const db = admin.firestore();

// test vision
console.log(vision("gs://trails-bb944.appspot.com/YDqKgLOAOWPMwFvMtfUCnUcIZyA2/1598166653852-2test.jpg"))

// use this route to get json result of the vision api and parsing an image! 
app.post('/tester', (req, res) => {
  (async () => {
    try {
      const result = await vision(req.body.gsUrl)
      return res.status(200).send(result)
    } catch (e) {
      return res.status(500).send(e)
    }
  })();
})

// get all receipts
app.get('/api/:userId/userReceipts', (req, res) => {
  (async () => {
    try {
      const colPath = db.collection('users').doc(req.params.userId).collection('userReceipts');
      let response = [];
      await colPath.orderBy('receiptDate', 'desc').get()
        .then(snapshot => {
          const docs = snapshot.docs || [];
          response = docs.map(doc => {
            const docData = doc.data() || {};
            docData.id = doc.id;
            return docData;
          })
          return null;
        }).catch(err => console.log('getAllReceipts:', err))
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
})

// get all receipts
app.get('/api/:userId/userReceipts/byMonth', (req, res) => {
  (async () => {
    try {
      const colPath = db.collection('users').doc(req.params.userId).collection('userReceipts');
      let response = {};
      await colPath.orderBy('receiptDate', 'desc').get()
        .then(snapshot => {
          const docs = snapshot.docs || [];
          docs.forEach(doc => {
            const docData = doc.data() || {};
            const monthNumber = getMonthNumber(docData.receiptDate);
            docData.id = doc.id;
            if (!response[monthNumber]) response[monthNumber] = []
            response[monthNumber].push(docData)
          })
          return null;
        }).catch(err => console.log('getAllReceipts:', err))
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
})

const getMonthNumber = (unixSeconds) => {
  const milliseconds = unixSeconds * 1000;
  const adjustedUTCTime = new Date(milliseconds - 1000 * 60 * 60 * 8);
  return (adjustedUTCTime.getUTCFullYear() - 1970) * 12 + adjustedUTCTime.getUTCMonth();
}

// get a specific receipt
app.get('/api/:userId/receipts/:receiptId', (req, res) => {
  (async () => {
    try {
      const docPath = db.collection('users').doc(req.params.userId).collection('receipts').doc(req.params.receiptId)
      const doc = await docPath.get();
      const response = doc.data() || {};
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
})

// update a receipt, whether it exists or not
app.put('/api/:userId/receipts/:receiptId', (req, res) => {
  (async () => {
    try {
      const docPath = db.collection('users').doc(req.params.userId).collection('receipts').doc(req.params.receiptId);
      await docPath.set(req.body, { merge: true });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
})

// delete a receipt
app.delete('/api/:userId/receipts/:receiptId', (req, res) => {
  (async () => {
    try {
      const docPath = db.collection('users').doc(req.params.userId).collection('receipts').doc(req.params.receiptId);
      await docPath.delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
})

exports.app = functions.https.onRequest(app);
// Can add this setting if we want express to automatically convert response data into a JSON
// app.use(express.json()) 

// TODO set up Firebase here


// TODO routes
// option 1: write them here
// option 2: use a sep file and tell express to use that


// Start express server
const port = process.env.PORT || 5000; // default if 5000, might have to set env PORT somewhere
// const port = 5000;
app.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`)
})

// process.on('uncaughtException', shutDown);
// process.on('SIGTERM', shutDown);

// let connections = [];

// app.on('connection', connection => {
//     connections.push(connection);
//     connection.on('close', () => connections = connections.filter(curr => curr !== connection));
// });

// function shutDown() {
//     console.log('Received kill signal, shutting down gracefully');
//     app.close(() => {
//         console.log('Closed out remaining connections');
//         process.exit(0);
//     });

//     setTimeout(() => {
//         console.error('Could not close connections in time, forcefully shutting down');
//         process.exit(1);
//     }, 10000);

//     connections.forEach(curr => curr.end());
//     setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
// }