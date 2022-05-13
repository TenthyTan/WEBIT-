const express = require('express')
// create our Router object
const clinicianRouter = express.Router()
// import demo controller functions
const patientController = require('../controllers/PatientController.js')
const clinicianController = require('../controllers/ClinicianController.js')

const passport = require('passport')
// import login
const sign = require('./login.js')


// clinicians dashboard
clinicianRouter.get('/dashboard', patientController.getAllRecords);

clinicianRouter.get('/home', clinicianController.renderHome);

clinicianRouter.get('/login', sign.unLoginDoctor, clinicianController.renderLoginPage)

clinicianRouter.post('/login',
                    sign.unLoginDoctor,
                    passport.authenticate('clinician_login',{
                    successRedirect: "/clinicians/home",
                    failureRedirect: "/clinicians/login",
                    failureFlash: true
}))

// export the router
module.exports = clinicianRouter