//const passport = require("../passport");

function unLoginPatient(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/patients/home')
    }
    next();
}

function isLoginPatient(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/patients/login')
}

function unLoginDoctor(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/clinicians/home')
    }
    next();
}

function isLoginDoctor(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/clinicians/login')
}

module.exports = {
    unLoginPatient,
    isLoginPatient,
    unLoginDoctor,
    isLoginDoctor
}