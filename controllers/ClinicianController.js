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

const renderCreateProfile = async (req, res) => {
    

    res.render("ClinicianCreateAccount.hbs", req.session.flash);
    
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

const createProfile = async (req, res) => {
    // check current doctor authority
    const doctor = await Doctor.findOne({"userName": req.session.userName})
    if(!doctor){
        console.log("Do not have authority to create account")
        req.flash("Error","Do not have authority to create account")
        return res.redirect('/clinicians/login')
    }
    // Check if repeated patients
    const userName = await Patient.findOne({"userName": req.body.userName})
    const email = await Patient.findOne({"email": req.body})
    
    if(userName){
        return res.render("ClinicianCreateAccount.hbs", {
            input: req.body,
            message: "The user name already exists, please try again",
          });
    }
    if(email){
        return res.render("ClinicianCreateAccount.hbs", {
            input: req.body,
            message: "The email address already exists, please try again",
          });
    }
    // Check passwords are same
    if (!(req.body.password === req.body.confirmPassword)){
        return res.render("ClinicianCreateAccount.hbs", {
            input: req.body,
            message: "The password is not the same, please try again",
        });
    }
    // Create new patient in database
    const newPatient = await new Patient({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
        yearOfBirth: req.body.year,
        supportMes: req.body.supportMessage,
        recordRate:0,
        records: [],
        doctor: doctor.userName

    })
    const patient = newPatient.save()
    

    

   res.render("ClinicianHome.hbs",{doctor: doctor});
    
};


const adddeletedata = async (req, res) => {
  try {
    const patientId = await initPatient();
    const recordId = await initRecord(patientId);
    // const patient = await Patient.findOne({ _id: patientId }).lean();
    const record = await Record.findOne({ _id: recordId })
      .populate({
        path: "patientID",
        options: { lean: true },
      })
      .lean();
    console.log(record);

    // console.log("-- record info when display -- ", record);
    res.render("Patientrecorddata.hbs", { record: record });
  } catch (err) {
    res.status(400);
    res.send("error happens when render record data");
  }
};



module.exports = {
    ChangeStatus,
    renderHome,
    renderLoginPage,
    initDoctor,
    renderCreateProfile,
    createProfile,
    adddeletedata,
}