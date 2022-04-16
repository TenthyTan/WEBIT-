//Import express//
const express = require('express')
// Set your app up as an express app
const app = express()
const port = 3000
// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.send('Our demo app is working!')});
// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(port, () => {
    console.log('Demo app is listening on http:localhost:' + port)});

app.get('/PatientHome', (req, res) => {
    res.send('patienthome')});

// link to our router
const demoRouter = require('./routes/demoRouter')
// the demo routes are added to the end of the '/demo-management' path
app.use('/demo-management', demoRouter)