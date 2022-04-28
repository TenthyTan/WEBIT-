const express = require('express')
// create our Router object
const clinicianRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/demoController.js')


// clinicians dashboard
//demoRouter.get('/dashboard', getAllPatients);