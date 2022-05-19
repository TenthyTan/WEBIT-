
const express = require('express')
// create our Router object
const patientRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/PatientController.js')
const passport = require('passport')
// import login
const sign = require('./login.js')

// add a route to handle the GET request for all demo data
// http://localjost:3000/patients/1/recordData
// add a route to handle the GET request for one data instance
patientRouter.get('/home', sign.isLoginPatient, demoController.renderHomePage);
patientRouter.get('/login', sign.unLoginPatient, demoController.renderLoginPage)
patientRouter.post('/login',
                    sign.unLoginPatient,
                    passport.authenticate('patient_login',{
                    successRedirect: "/patients/home",
                    failureRedirect: "/patients/login",
                    failureFlash: true
                    })
);
patientRouter.get('/recordData',sign.isLoginPatient, demoController.renderRecordData)
patientRouter.post("/recordData", sign.isLoginPatient, demoController.updateRecord);
patientRouter.get('/profile', sign.isLoginPatient, demoController.renderProfile);
patientRouter.get('/viewTable', sign.isLoginPatient, demoController.viewTable);
patientRouter.get('/viewChart', sign.isLoginPatient, demoController.viewChart);
patientRouter.get('/recordRank', sign.isLoginPatient, demoController.rankBoard);
patientRouter.get('/updatePassword', sign.isLoginPatient, demoController.renderUpdate);
patientRouter.post('/updatePassword', sign.isLoginPatient, demoController.changePassword);
patientRouter.post('/logout', sign.isLoginDoctor, demoController.logout)
patientRouter.get('/:id', demoController.getDataById);


// export the router
module.exports = patientRouter