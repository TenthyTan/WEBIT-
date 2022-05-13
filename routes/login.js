//const passport = require("../passport");

function unLoginPatient(req, res, next){
    
    if(req.isAuthenticated()){
        if(req.user.role === "patient"){
            return res.redirect('/patients/home')
        }
    }
    next();
}

function isLoginPatient(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "patient"){
            return next();
        }
       
    }
    res.redirect('/patients/login')
}

function unLoginDoctor(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "doctor"){

            return res.redirect('/clinicians/home')
        }
       
    }
    next();
}

function isLoginDoctor(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.role === "doctor"){
            return next();
        }
    }
    res.redirect('/clinicians/login')
}

module.exports = {
    unLoginPatient,
    isLoginPatient,
    unLoginDoctor,
    isLoginDoctor
}