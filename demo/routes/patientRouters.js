const express = require('express')
// create our Router object
const demoRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/demoController.js')
// add a route to handle the GET request for all demo data
demoRouter.get('/', demoController.getAllPatients)
// add a route to handle the GET request for one data instance
demoRouter.get('/recordData',demoController.renderRecordData)
demoRouter.post("/recordData", demoController.updateRecord);
demoRouter.get('/:id', demoController.getDataById)

// export the router
module.exports = patientRouter


// const express = require("express");
// const controller = require("../controllers/demoController.js");
// const demoRouter = express.Router();

// demoRouter.get("/", controller.getAllPatients);
// demoRouter.get("/recordData", controller.renderRecordData);
// demoRouter.post("/recordData", controller.updateRecord);
// demoRouter.get("/:id", controller.getOnePatient);
// demoRouter.post("/addPatient", controller.addOnePatient);
// // demoRouter.get("/recordData", controller.renderRecordData);

// module.exports = demoRouter;