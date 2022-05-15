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


clinicianRouter.get('/home', sign.isLoginDoctor, clinicianController.renderHome);

clinicianRouter.get('/login', sign.unLoginDoctor, clinicianController.renderLoginPage)

clinicianRouter.post('/login',
                    sign.unLoginDoctor,
                    passport.authenticate('doctor_login',{
                    successRedirect: "/clinicians/home",
                    failureRedirect: "/clinicians/login",
                    failureFlash: true
}))

clinicianRouter.get('/doctorProfile',sign.isLoginDoctor, clinicianController.initDoctor)

clinicianRouter.get('/createProfile',sign.isLoginDoctor, clinicianController.renderCreateProfile)

clinicianRouter.post('/createProfile',sign.isLoginDoctor, clinicianController.createProfile)

clinicianRouter.get('/profile',sign.isLoginDoctor, clinicianController.renderProfile)
// export the router
module.exports = clinicianRouter