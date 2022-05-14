/*
 * @Description: 
 * @Author: wanglinhui
 * @Date: 2022-05-13 20:48:30
 * @LastEditTime: 2022-05-14 14:44:20
 * @LastEditors: wanglinhui
 */
const express = require('express')
// create our Router object
const patientRouter = express.Router()
// import demo controller functions
const demoController = require('../controllers/PatientController.js')
const passport = require('passport')
// import login
const sign = require('./login.js')

// add a route to handle the GET request for all demo data
// http://localhost:3000/patients/recordData/1

// http://localjost:3000/patients/1/recordData
patientRouter.get('/', demoController.getAllPatients)
// add a route to handle the GET request for one data instance
patientRouter.get('/home', demoController.renderHomePage);
patientRouter.get('/login', sign.unLoginPatient, demoController.renderLoginPage)
patientRouter.post('/login',
                    sign.unLoginPatient,
                    passport.authenticate('patient_login',{
                    successRedirect: "/patients/home",
                    failureRedirect: "/patients/login",
                    failureFlash: true
                    })
);
patientRouter.get('/recordData',demoController.renderRecordData)
patientRouter.get('/patientData',demoController.renderPatientData)
patientRouter.post("/recordData", demoController.updateRecord);
patientRouter.get('/:id', demoController.getDataById);


// 

// export the router
module.exports = patientRouter