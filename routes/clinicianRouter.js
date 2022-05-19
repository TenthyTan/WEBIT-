const express = require('express')
// create our Router object
const clinicianRouter = express.Router()
// import demo controller functions
const clinicianController = require('../controllers/ClinicianController.js')
const passport = require('passport')
// import login
const sign = require('./login.js')

clinicianRouter.get('/home', sign.isLoginDoctor, clinicianController.renderHome);

clinicianRouter.get('/login', sign.unLoginDoctor, clinicianController.renderLoginPage)
clinicianRouter.post('/login',
                    sign.unLoginDoctor,
                    passport.authenticate('doctor_login',{
                    successRedirect: "/clinicians/home",
                    failureRedirect: "/clinicians/login",
                    failureFlash: true
}))

clinicianRouter.get('/createProfile',sign.isLoginDoctor, clinicianController.renderCreateProfile)
clinicianRouter.post('/createProfile',sign.isLoginDoctor, clinicianController.createProfile)

clinicianRouter.get('/profile',sign.isLoginDoctor, clinicianController.renderProfile)

clinicianRouter.get('/updatePassword',sign.isLoginDoctor, clinicianController.renderUpdate)
clinicianRouter.post('/updatePassword',sign.isLoginDoctor, clinicianController.changePassword)

clinicianRouter.get('/dashboard', sign.isLoginDoctor, clinicianController.renderDashboard);

clinicianRouter.get('/dashboard/:_id', sign.isLoginDoctor, clinicianController.renderPatientData);

clinicianRouter.get('/dashboard/:_id/viewChart', sign.isLoginDoctor, clinicianController.viewChart)

clinicianRouter.get('/dashboard/:_id/messages', sign.isLoginDoctor, clinicianController.renderSupportMessage)
clinicianRouter.post('/dashboard/:_id/messages', sign.isLoginDoctor, clinicianController.updateSupportMessages)

clinicianRouter.get('/dashboard/:_id/safetyThreshold', sign.isLoginDoctor, clinicianController.renderThreshold)
clinicianRouter.post('/dashboard/:_id/safetyThreshold', sign.isLoginDoctor, clinicianController.UpdateThreshold)

clinicianRouter.get('/dashboard/:_id/listClinicalNotes', sign.isLoginDoctor, clinicianController.renderClinicalNotes)

clinicianRouter.get('/viewComments', sign.isLoginDoctor, clinicianController.viewComments)

clinicianRouter.get('/dashboard/:_id/clinicalNotes', sign.isLoginDoctor, clinicianController.renderAddNote)
clinicianRouter.post('/dashboard/:_id/clinicalNotes', sign.isLoginDoctor, clinicianController.addNote)

clinicianRouter.get('/checkComment', sign.isLoginDoctor, clinicianController.renderCheckComment)

clinicianRouter.post('/logout', sign.isLoginDoctor, clinicianController.logout)


// export the router
module.exports = clinicianRouter