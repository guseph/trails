
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9a206..firebaseio.com"
});
const db = admin.firestore();

app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!');
});

// create
app.post('/api/create', (req, res) => {
  (async () => {
    try {
      await db.collection('items').doc('/' + req.body.id + '/')
        .create({item: req.body.item});
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

exports.app = functions.https.onRequest(app);
// Can add this setting if we want express to automatically convert response data into a JSON
// app.use(express.json()) 

// TODO set up Firebase here


// TODO routes
// option 1: write them here
// option 2: use a sep file and tell express to use that


// Start express server
const port = process.env.PORT || 5000; // default if 5000, might have to set env PORT somewhere
app.listen(port, () => {
    console.log(`Server is up and running on port: ${port}`)
})