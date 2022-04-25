//Import express//
const { urlencoded } = require('express');
const express = require('express');
// Set your app up as an express app
const exphbs = require('express-handlebars'); // include Handlebars module

const app = express();
const port = 3000;

// To encode the res body
app.use(express.json());
app.use(urlencoded({exphbs : true}))

app.engine('hbs', exphbs.engine({      // configure Handlebars
    defaultlayout: 'main',
    extname: 'hbs',
    helpers: require("./public/js/helpers").helpers,
}));
app.set('view engine', 'hbs');   // set Handlebars view engine
// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('PatientHome.hbs')});
// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(port, () => {
    console.log('Demo app is listening on http:localhost:' + port)});

// // link to our router
// const demoRouter = require('./routes/demoRouter');
// // the demo routes are added to the end of the '/demo-management' path
// app.use('/demo-management', demoRouter);

// app.use(express.static('public')) // define where static assets live





