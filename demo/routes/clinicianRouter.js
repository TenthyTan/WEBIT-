const express = require('express')
// create our Router object
const clinicianRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/demoController.js')


// clinicians dashboard
clinicianRouter.get('/dashboard', demoController.getAllRecords);

// export the router
module.exports = clinicianRouter