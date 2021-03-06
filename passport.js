//const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt");

// import patient and clinicians models
const Doctor = require('./models/doctors')
const Patient = require('./models/patients')
const process = require('process')



module.exports = (passport) => {

  // Store user information
  passport.serializeUser((user, done)=>{
   // patient.permission = "patient"
    done(null, {_id: user._id, role: user.role})
  });

  passport.deserializeUser((user, done) => {
    if(user.role === "patient"){
      Patient.findById(user._id, (err, patient)=>{
        return done(err, patient)
    })
    }else if(user.role === "doctor"){
      Doctor.findById(user._id, (err, doctor)=>{
        return done(err, doctor)
      })
    }else{
      return done("This user have no authority to log in", null)
    }
  })




// For patient login
  passport.use(
    "patient_login",
    new LocalStrategy({
      usernameField: "userID",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, userID, password, done) => {
      process.nextTick(()=>{
        Patient.findOne({'email': userID}, async(err, patient)=>{
          if(err){
            return done(err)
             
          }else if(!patient){
            return done(null, false, req.flash('loginMessage', 'Can not find a user.'))
          //}else if(!await bcrypt.compare(password, patient.password)){
          //  return done(null, false,  req.flash('loginMessage', 'Incorrect Password'))
         // }else{
          //  return done(null, patient, req.flash('loginMessage', 'Log In Successfully'))
          }
          // Check password
          patient.verifyPassword(password,(err, valid) =>{
            if(err){
              return done(err)
            }
            if(!valid){
              return done(null, false,  req.flash('loginMessage', 'Incorrect Password'))
            }
            // If user and password all correct
            req.session.userID = userID
            return done(null, patient, req.flash('loginMessage', 'Log In Successfully'))
          })
         //!(password == patient.password)
         //!await bcrypt.compare(password, patient.password)
          
        })
      })
    })
    
  )
// For doctor login
  passport.use(
    "doctor_login",
    new LocalStrategy({
      usernameField: "userID",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, userID, password, done) => {
      process.nextTick(()=>{
        Doctor.findOne({'email': userID}, async(err, doctor)=>{
          if(err){
            return done(err)
          }
          //console.log(await bcrypt.hash(doctor.password,10))
          if(!doctor){
            return done(null, false, req.flash('loginMessage', 'Can not find a user.'))
          }else if (!await bcrypt.compare(password, doctor.password)){
            return done(null, false, req.flash('loginMessage', 'incorrect password.'))
          }else{
            req.session.userID = userID
            return done(null, doctor, req.flash('loginMessage', 'Login successful'));
          }
          // Check password
          //doctor.verifyPassword(password,(err, valid) =>{
            
          //  if(err){
          //    return done(err)
          //  }
          //  if(!valid){
          //    return done(null, false,  req.flash('loginMessage', 'Incorrect Password'))
          //  }
            // If user and password all correct
          //  return done(null, doctor, req.flash('loginMessage', 'Log In Successfully'))
         // })
          
        })
      })
    })
  )


}