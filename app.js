//Import express//
const { urlencoded } = require('express');
const express = require('express');
// Set your app up as an express app
const exphbs = require('express-handlebars'); // include Handlebars module
//const res = require('express/lib/response');
const bodyParser = require('body-parser')

require('./models')
// Connect to mongodb
//require('../models/database.js');
const path = require('path')


const app = express();
const port = 3000;

Patient = require('./models/patients.js')
// To encode the res body
app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.engine('hbs', exphbs.engine({      // configure Handlebars
    defaultlayout: 'main',
    extname: 'hbs',
    helpers: require("./public/js/helpers.js").helpers
}));
app.set('view engine', 'hbs');   // set Handlebars view engine
// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.

// /Tells the app to listen on port 3000 and logs that information to the console.
// app.listen(port, () => {
//     console.log('Demo app is listening on http:localhost:' + port)});


const patientRouter = require("./routes/patientRouters.js");
const clinicianRouter = require("./routes/clinicianRouter.js");
    
// http://localhost:3000/patients
// http://localhost:3000/clinicians
app.use("/patients", patientRouter);
app.use("/clinicians", clinicianRouter);

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('PatientHome.hbs')});

// app.get('/recordData', (req, res) => {
//     res.render('Patientrecorddata.hbs')});

// app.get('/viewdata', (req, res) => {
//     res.render('Patientviewdata.hbs')});


// const generalRouter = require("../demo/routes/demoRouters.js");

// app.use("/general", generalRouter);
app.use(bodyParser.urlencoded({extended:true}))

app.listen(process.env.PORT || 3000, () => {
    console.log("> Server is up and running on http://localhost:" + port)
})


// // link to our router
// const demoRouter = require('../demo/routes/demoRouters.js');
// // the demo routes are added to the end of the '/demo-management' path
// app.use('/demo-management', demoRouter);

// app.use(express.static('public')) // define where static assets live





