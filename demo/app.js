//Import express//
//const { urlencoded } = require('express');
const express = require('express');
// Set your app up as an express app
const exphbs = require('express-handlebars'); // include Handlebars module
//const res = require('express/lib/response');

// Connect to mongodb
require('./models/database.js');
Patient = require('./models/patients.js');

const app = express();
const port = 3000;

// To encode the res body
app.use(express.json());
app.use(urlencoded({exphbs : true}))

app.engine('hbs', exphbs.engine({      // configure Handlebars
    defaultlayout: 'main',
    extname: 'hbs',
    helpers: require("../demo/public/js/helpers.js").helpers,
}));
app.set('view engine', 'hbs');   // set Handlebars view engine
// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
// http://localjost:3000/
app.get('/', (req, res) => {
    res.render('PatientHome.hbs')});
// Tells the app to listen on port 3000 and logs that information to the console.
// app.listen(port, () => {
//     console.log('Demo app is listening on http:localhost:' + port)});

const patientRouter = require("./routes/patientRouters.js");
const clinicianRouter = require("./routes/clinicianRouter");

// http://localjost:3000/patients
// http://localjost:3000/clinicians
app.use("/patients", patientRouter);
app.use("/clinicians", clinicianRouter);

app.listen(port, () =>
  console.log("> Server is up and running on http://localhost:" + port)
);

// app.get('/record', (req, res) => {
//     res.render('Patientrecord.hbs')})

// // link to our router
// const demoRouter = require('./routes/demoRouter');
// // the demo routes are added to the end of the '/demo-management' path
// app.use('/demo-management', demoRouter);

// app.use(express.static('public')) // define where static assets live





