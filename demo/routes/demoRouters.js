const express = require('express')
// create our Router object
const demoRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/demoController')
// add a route to handle the GET request for all demo data
demoRouter.get('/', demoController.getAllDemoData)
// add a route to handle the GET request for one data instance
demoRouter.post('/recordData',demoController.updateRecord)
demoRouter.get('/:id', demoController.getDataById)


// export the router
module.exports = demoRouter