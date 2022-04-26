//Import express//
const { urlencoded } = require('express');
const express = require('express');
// Set your app up as an express app
const exphbs = require('express-handlebars'); // include Handlebars module
//const res = require('express/lib/response');

// Connect to mongodb
require('./models/database.js');

const app = express();
const port = 3000;

Patient = require('../demo/models/patients.js')
// To encode the res body
app.use(express.json());
app.use(urlencoded({exphbs : true}))

app.engine('hbs', exphbs.engine({      // configure Handlebars
    defaultlayout: 'main',
    extname: 'hbs',
    // helpers: require("../demo/public/js/helpers.js").helpers,
}));
app.set('view engine', 'hbs');   // set Handlebars view engine
// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('PatientHome.hbs')});
// /Tells the app to listen on port 3000 and logs that information to the console.
// app.listen(port, () => {
//     console.log('Demo app is listening on http:localhost:' + port)});


app.get('/record', (req, res) => {
    res.render('recordData.hbs')});

app.get('/viewdata', (req, res) => {
    res.render('allData.hbs')});

const patientRouter = require("../demo/routes/patientRouters.js");
const clinicianRouter = require("../demo/routes/clinicianRouter.js");
    
    // http://localjost:3000/patients
    // http://localjost:3000/clinicians
app.use("/patients", patientRouter);
app.use("/clinicians", clinicianRouter);


const generalRouter = require("../demo/routes/demoRouters.js");

// app.use("/general", generalRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("> Server is up and running on http://localhost:" + port)
})


// // link to our router
// const demoRouter = require('../demo/routes/demoRouters.js');
// // the demo routes are added to the end of the '/demo-management' path
// app.use('/demo-management', demoRouter);

// app.use(express.static('public')) // define where static assets live





