// import Model
const mongoose = require("mongoose");
const { findOneAndUpdate } = require("../models/records.js");
const Patient = require("../models/patients.js");
const Record = require("../models/records.js");
const Doctor = require("../models/doctors.js");
const bcrypt = require("bcrypt");

function ChangeStatus() {
    
}

const renderHome = async (req, res) => {

    const doctorId = await initDoctor()
    const doctor = Doctor.findOne({_id: doctorId})

    res.render("ClinicianHome.hbs",{doctor: doctor});
    
};

const renderLoginPage = async (req, res) => {
    

    res.render("Clinicianslogin.hbs", req.session.flash);
    
};

// Create a doctor Chris
async function initDoctor() {
    try {
      // find all document in Patient Collection to findout if it is empty
  
      //const hash = await bcrypt.hash('12345678', 10)
      const result = await Doctor.find();
      if (result.length == 0) {
        const newDoctor = new Doctor({
          firstName: "Chris",
          lastName: "Li",
          userName: "chris",
          password : "12345678",
          email: "chris@gmail.com",         
        });
        // save new doctor to database
        const doctor = await newDoctor.save();
        // console.log("-- id is: ", patient.id);  
        return doctor.id;
      } else {
        // find our target patient Pat
        const doctor = await Doctor.findOne({ userName: "chris" });
        // console.log("-- id is: ", patient.id);
        return doctor.id;
      }
    } catch (err) {
      console.log("error happens in doctor initialization: ", err);
    }
  }


module.exports = {
    ChangeStatus,
    renderHome,
    renderLoginPage,
    initDoctor,
}