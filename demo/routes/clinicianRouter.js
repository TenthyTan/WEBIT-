const express = require('express')
// create our Router object
const demoRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/demoController.js')


// clinicians dashboard
demoRouter.get('/clinicians')