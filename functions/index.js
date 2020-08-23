
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

// get all receipts, depending on sort methods/direction
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

// get all receipts with year param
app.get('/api/:userId/userReceipts/:year', (req, res) => {
  (async () => {
    try {
      const startDate = new Date(req.params.year, 0);
      const endDate = new Date(req.params.year, 11);
      const colPath = db.collection('users').doc(req.params.userId).collection('userReceipts');
      let response = {};
      await colPath.where('receiptDate', '>=', startDate.getTime()/1000).where('receiptDate', '<=', endDate.getTime()/1000).get()
        .then(snapshot => {
          const docs = snapshot.docs || [];
          docs.forEach(doc => {
            const docData = doc.data() || {};
            docData.id = doc.id;
            const monthNumber = new Date(docData.receiptDate * 1000).getMonth(); // 0-indexed
            docData.monthNumber = monthNumber;
            if (!response[monthNumber]) response[monthNumber] = [];
            response[monthNumber].push(docData);
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

// get an array of total spendings per month for a year
app.get('/api/:userId/userReceipts/:year/monthlySpendings', (req, res) => {
  (async () => {
    try {
      const startDate = new Date(req.params.year, 0);
      const endDate = new Date(req.params.year, 11);
      const colPath = db.collection('users').doc(req.params.userId).collection('userReceipts');
      let response = [0,0,0,0,0,0,0,0,0,0,0,0];
      await colPath.where('receiptDate', '>=', startDate.getTime()/1000).where('receiptDate', '<=', endDate.getTime()/1000).get()
        .then(snapshot => {
          const docs = snapshot.docs || [];
          docs.forEach(doc => {
            const docData = doc.data() || {};
            const monthNumber = new Date(docData.receiptDate * 1000).getMonth(); // 0-indexed
            response[monthNumber] += docData.total;
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

// get total spendings, tax for the year
app.get('/api/:userId/userReceipts/:year/yearStats', (req, res) => {
  (async () => {
    try {
      const startDate = new Date(req.params.year, 0);
      const endDate = new Date(req.params.year, 11);
      const colPath = db.collection('users').doc(req.params.userId).collection('userReceipts');
      let response = [0,0]; // [0] is total, [1] is tax
      await colPath.where('receiptDate', '>=', startDate.getTime()/1000).where('receiptDate', '<=', endDate.getTime()/1000).get()
        .then(snapshot => {
          const docs = snapshot.docs || [];
          docs.forEach(doc => {
            const docData = doc.data() || {};
            response[0] += docData.total || 0;
            response[1] += docData.tax || 0;
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

// get total spendings, tax, # receipts for a month
app.get('/api/:userId/userReceipts/monthStats/:year/:month', (req, res) => {
  (async () => {
    try {
      const startDate = new Date(req.params.year, req.params.month, 1);
      const endDate = new Date(req.params.year, req.params.month + 1);
      const colPath = db.collection('users').doc(req.params.userId).collection('userReceipts');
      let response = [0,0,0]; // [0] is total, [1] is tax
      await colPath.where('receiptDate', '>=', startDate.getTime()/1000).where('receiptDate', '<', endDate.getTime()/1000).get()
        .then(snapshot => {
          const docs = snapshot.docs || [];
          docs.forEach(doc => {
            const docData = doc.data() || {};
            response[0] += docData.total || 0;
            response[1] += docData.tax || 0;
            response[2] += 1;
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

// get oldest receipt doc
app.get('/api/:userId/userReceipts/oldestReceipt', (req, res) => {
  (async () => {
    try {
      const colPath = db.collection('users').doc(req.params.userId).collection('userReceipts');
      let response = {};
      await colPath.orderBy('receiptDate', 'asc').limit(1).get()
        .then(snapshot => {
          const doc = (snapshot.docs || [])[0];
          const docData = doc.data() || {};
          docData.id = doc.id;
          response = docData
          return null;
        }).catch(err => console.log('getAllReceipts:', err))
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
})

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