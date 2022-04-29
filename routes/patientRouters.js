const express = require('express')
// create our Router object
const patientRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/demoController.js')

// add a route to handle the GET request for all demo data
// http://localhost:3000/patients/recordData/1

// http://localjost:3000/patients/1/recordData
patientRouter.get('/', demoController.getAllPatients)
// add a route to handle the GET request for one data instance

patientRouter.get('/recordData',demoController.renderRecordData)
patientRouter.post("/recordData", demoController.updateRecord);
patientRouter.get('/:id', demoController.getDataById)
// 

// export the router
module.exports = patientRouter