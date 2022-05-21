//Import express//

require("dotenv").config();
const { urlencoded } = require('express');
const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
// Set your app up as an express app
const exphbs = require('express-handlebars'); // include Handlebars module
//const res = require('express/lib/response');
const bodyParser = require('body-parser')
const passport = require('passport')
require('./passport')(passport)


const session = require("express-session")
const flash = require("express-flash")


require('./models')
require('./models/index.js')
// Connect to mongodb
//require('../models/database.js');
const path = require('path')



const port = 3000;
//app.use(passport.authenticate('session'))
Patient = require('./models/patients.js')

app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'strict',
        httpOnly: true,
        secure: app.get('env') === 'production'
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
    }



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

// const messageRouter = require('./routes/message.js')
    
// http://localhost:3000/patients
// http://localhost:3000/clinicians
app.use("/patients", patientRouter);
app.use("/clinicians", clinicianRouter);


app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))

app.get("/", (req, res) => {
    res.render("Welcome.hbs");
  });


app.get("/AboutDiabetes", (req, res) => {
    res.render("AboutDiabetes.hbs");
})


app.get("/AboutWebsite", (req, res) => {

    res.render("AboutWebsite.hbs");
})
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




