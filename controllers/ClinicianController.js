// import Model
const mongoose = require("mongoose");
const { findOneAndUpdate, update } = require("../models/records.js");
const Patient = require("../models/patients.js");
const Record = require("../models/records.js");
const Doctor = require("../models/doctors.js");
const bcrypt = require("bcrypt");



const renderHome = async (req, res) => {

    //const doctorId = await initDoctor()
    const doctor = await Doctor.findOne({"email": req.session.userID}).lean()


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
      const doctor1 = await Doctor.findOne({ userName: "chris" });
      const doctor2 = await Doctor.findOne({ userName: "tony" });
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
      } else if (!doctor2){
        const newDoctor2 = new Doctor({
          firstName: "tony",
          lastName: "chen",
          userName: "tony",
          password : "12345678",
          email: "tony@gmail.com",         
        });
        // save new doctor to database
        const doctor = await newDoctor2.save();
        return doctor.id;
      }else{
        return doctor1.id
      }
    } catch (err) {
      console.log("error happens in doctor initialization: ", err);
    }
  }

  const createProfile = async (req, res) => {
    // check current doctor authority
    console.log(req.session.userID)
    const doctor = await Doctor.findOne({"email": req.session.userID}).lean()

    if(!doctor){
        console.log("Do not have authority to create account")
        req.flash("Error","Do not have authority to create account")
        return res.redirect('/clinicians/login')
    }
    // Check if repeated patients
    const userName = await Patient.findOne({"userName": req.body.userName}).lean()
    const email = await Patient.findOne({"email": req.body.email}).lean()
    
    if(userName){
        console.log("exited")
        return res.render("ClinicianCreateAccount.hbs", {
            input: req.body,
            message: "The user name already exists, please try again",
          });
    }
    if(email){
        console.log("exited")
        return res.render("ClinicianCreateAccount.hbs", {
            input: req.body,
            message: "The email address already exists, please try again",
          });
    }
    // Check passwords are same
    if (!(req.body.password === req.body.confirmPassword)){
        console.log("not same password")
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

    const patient = await newPatient.save()
    
    // Save the patient id to doctor database
    const clinician = await Doctor.findById(doctor._id)
    clinician.patients.push({patientIDs: patient._id, patientName: patient.userName})
    await clinician.save()   
    console.log("success!")
    return res.render("ClinicianHome.hbs",{message: "Create Successfully!"})
    
};


const checkbox = async (req, res) => {
  const patientId = await initPatient();
  const recordId = await initRecord(patientId);
  const record = await Record.findOne({ _id: recordId });
  const input = await Record.findOne({ _id: recordId });
  if (input.type == 'checkbox' & input.name == 'bgl_checkbox'){
    if(input.checked){
      Record.findOneAndUpdate({name:""},{status:"Unrecorded"})
    }
    else{
      Record.findOneAndUpdate({name:""},{status:"Not require"})
    }
  }
};

const renderProfile = async (req, res) => {

  const doctor = await Doctor.findOne({"email": req.session.userID}).lean()

  res.render("Clinicianprofile.hbs", { doctor: doctor });
  
};

const renderDashboard = async(req, res) => {
  try{
    // find current doctor
    const doctor = await Doctor.findOne({"email": req.session.userID}).lean()
    // find all the patients belongs to this doctor
    const patients = await Patient.find({"doctor" : doctor.userName}).lean()
    console.log(patients)
    const records = await Record.find({patientID: {"$in" : patients}, recordDate: formatDate(new Date())}).populate({
      path: "patientID",
      options: { lean: true },
    }).lean();    
    console.log(JSON.stringify(records))
   res.render('Cliniciandashboard.hbs', {record: records, doctor: doctor}); // send data to browser
  }catch(err){
    console.log("error happens ", err);

  }
}

function formatDate(date) {
  var d = new Date(date), //creat a new data
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-"); //return as 2002-06-09
}

const changePassword = async(req, res) => {
  try{
    // find current doctor
    const doctor = await Doctor.findOne({"email": req.session.userID}).lean()
  
    if (!await bcrypt.compare(oldPassword, doctor.password)){
      console.log("The old password is not correct")
      return res.render("ClinicianCreateAccount.hbs", {
          input: req.body,
          message: "The old password is incorrect, please try again",
      });
    }else if (!(req.body.newPassword === req.body.confirmPassword)){
      console.log("not same password")
      return res.render("ClinicianCreateAccount.hbs", {
          input: req.body,
          message: "The password is not the same, please try again",
      });
    } else if ((req.body.oldPassword === req.body.newPassword)){
      console.log("the old psd is same as new password")
      return res.render("ClinicianCreateAccount.hbs", {
          input: req.body,
          message: "The old password is the same as the new password, please try again",
      });
    }
    
      doctor.password = req.body.newPassword
      await doctor.save()
      
   
  }catch(err){
    console.log("error happens ", err);

  }
}

function age(birth) {

  const d = new Date()
  const year = d.getFullYear()
  const age = String(year - birth)
  const data = {
    "age": age
  }
  return data
};

const ClinicianViewTable = async (req, res) => {
  // find current doctor
  const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
  // find all the patients belongs to this doctor
  const patient = await Patient.find({"doctor" : doctor.userName}).lean()
  // find all patients record (for patients who belong to the doctor )//
  const record = await Record.find({patientID: {"$in" : patient}}).lean()
  const pAge = age(patient.yearOfBirth);
  res.render("Cliniciansviewdata.hbs", { patient : patient, record: record, age: pAge, dotor: doctor});
};


const SupportMessage = async (req, res) => {
  // find current doctor
  const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
  // find all the patients belongs to this doctor
  const patient = await Patient.find({"doctor" : doctor.userName}).lean()
  // find all patients record (for patients who belong to the doctor )//
  res.render("Cliniciansupportmessage.hbs", { patient : patient, dotor: doctor});
};

const renderThreshold = async (req, res) => {
  
  res.render("Clinicianthreshold.hbs");
};

module.exports = {
    age,
    renderHome,
    renderLoginPage,
    initDoctor,
    renderCreateProfile,
    createProfile,
    checkbox,
    renderProfile,
    formatDate,
    renderDashboard,
    changePassword,
    ClinicianViewTable,
    SupportMessage,
    renderThreshold,
}