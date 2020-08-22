const express = require("express")

const app = express() 
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