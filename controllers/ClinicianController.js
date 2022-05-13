// import Model
const mongoose = require("mongoose");
const { findOneAndUpdate } = require("../models/records.js");
const Patient = require("../models/patients.js");
const Record = require("../models/records.js");
const Doctor = require("../models/doctors.js");

function ChangeStatus() {
    
}

const renderHome = async (req, res) => {
  
    res.render("ClinicianHome.hbs", req.session.flash);
    
};

const renderLoginPage = async (req, res) => {
  
    res.render("ClinicianHome.hbs", req.session.flash);
    
};


module.exports = {
    ChangeStatus,
    renderHome,
    renderLoginPage,


}