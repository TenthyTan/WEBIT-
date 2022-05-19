// import Model
const mongoose = require("mongoose");
const { findOneAndUpdate, update } = require("../models/records.js");
const Patient = require("../models/patients.js");
const Record = require("../models/records.js");
const Doctor = require("../models/doctors.js");
const Note = require("../models/note.js");
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
    return res.redirect("/clinicians/dashboard/" + patient._id + "/safetyThreshold")
    
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
    const records = await Record.find({patientID: {"$in" : patients}, recordDate: formatDate(new Date())}).populate({
      path: "patientID",
      options: { lean: true },
    }).lean();    
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
  
    if (!await bcrypt.compare(req.body.oldPassword, doctor.password)){
      console.log("The old password is not correct")
      return res.render("clinicianChangePassword.hbs", {
          input: req.body,
          message: "The old password is incorrect, please try again",
      });
    }else if (!(req.body.newPassword === req.body.confirmPassword)){
      console.log("not same password")
      return res.render("clinicianChangePassword.hbs", {
          input: req.body,
          message: "The password is not the same, please try again",
      });
    } else if ((req.body.oldPassword === req.body.newPassword)){
      console.log("the old psd is same as new password")
      return res.render("clinicianChangePassword.hbs", {
          input: req.body,
          message: "The old password is the same as the new password, please try again",
      });
    }
      const clinician = await Doctor.findById(doctor._id)
      clinician.password = req.body.newPassword
      await clinician.save()
      //Doctor.findOneAndUpdate({email: req.session.userID},{password: req.body.newPassword})
      return res.render("clinicianChangePassword.hbs", {
        input: req.body,
        message: "Update successfully!",
    });
      //doctor.password = req.body.newPassword
      
      
   
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
  const patient =  await Patient.findOne({"_id": req.params._id}).lean()
  //find all patients record (for patients who belong to the doctor )//
  const record = await Record.find({"patientID":  patient._id}).lean()
  //const pAge = age(patient.yearOfBirth);
  res.render("Clinicianviewdatachart.hbs", { patient : patient, record: record});
};

const renderPatientData = async (req, res) => {
  // find current doctor
  // dashboard/:id
  const patient =  await Patient.findOne({"_id": req.params._id}).lean()
  const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
  const record = await Record.find({ "patientID":  patient._id}).lean()
  const pAge = age(patient.yearOfBirth);

  
  res.render("Cliniciansviewdata.hbs", { patient : patient, record: record, age: pAge, doctor: doctor});
};


const renderSupportMessage = async (req, res) => {
  // find current doctor
  const patient =  await Patient.findOne({"_id": req.params._id}).lean()
  const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
  
  // find all patients record (for patients who belong to the doctor )//
  res.render("Cliniciansupportmessage.hbs", { patient : patient, doctor: doctor});
};

const updateSupportMessages = async (req, res) => {
  try {

    const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
    // find all the patients belongs to this doctor
   
    const patient =  await Patient.findById(req.params._id)
    console.log(req.body.supportMessage)
    patient.supportMes = req.body.supportMessage;

    await patient.save(); ///patient Id 要改
    res.redirect("/clinicians/dashboard/" + req.params._id + "/messages");
   
  } catch (err) {
    console.log(err);
    
    res.send("error happens when update support message");

  }
};




// const renderThreshold = async (req, res) => {
//   const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
//   // find all the patients belongs to this doctor
//   const patient = await Patient.find({"doctor" : doctor.userName}).lean()
//   const record = await Record.find({patientID: {"$in" : patient}}).lean()
//   console.log(req)
//   var MinThreshold_bgl = $('input[name="value_bgl_min"]').val();
//   var MaxThreshold_bgl = $('input[name="value_bgl_max"]').val();
//   record.findOneAndUpdate({"name":"Blood Glucose Level (nmol/L)"}, {"minThreshold":MinThreshold_bgl});
//   record.findOneAndUpdate({"name":"Blood Glucose Level (nmol/L)"}, {"maxThreshold":MaxThreshold_bgl});
  
//   res.render("Clinicianthreshold.hbs");
// };

const renderUpdate = async(req, res) => {
  try{
    const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
    res.render('ClinicianChangePassword.hbs',{doctor: doctor}); // send data to browser
  }catch(err){
    console.log("error happens ", err);

  }
}

const renderThreshold = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
    //const patientId = await initPatient();
    //const record = await Record.findOne({patientID: }).lean()
    const patient = await Patient.findOne({"_id": req.params._id}).lean()
    res.render("Clinicianthreshold.hbs", { doctor: doctor, patient: patient});
  } catch (err) {
    res.status(400);
    res.send("error happens when render Threshold");
  }
};

const UpdateThreshold = async (req, res) => {
  try {
    console.log("-- req body when update threshold", req.body);
    const patient = await Patient.findById(req.params._id);
    const record = await Record.findOne({patientID: patient._id});
    console.log(req.body.bgl)
    if (req.body.bgl === "Record"){
      patient.timeseries.bgl.check = "true"
      patient.timeseries.bgl.min = req.body.bgl_min_value
      patient.timeseries.bgl.max = req.body.bgl_max_value
    }else{
      patient.timeseries.bgl.check = "false"
    }

    if (req.body.weight === "Record"){
      patient.timeseries.weight.check = "true"
      patient.timeseries.weight.min = req.body.weight_min_value
      patient.timeseries.weight.max = req.body.weight_max_value
    }else{
      patient.timeseries.weight.check = "false"
    }

    if (req.body.doit === "Record"){
      patient.timeseries.doit.check = "true"
      patient.timeseries.doit.min = req.body.doit_min_value
      patient.timeseries.doit.max = req.body.doit_max_value
    }else{
      patient.timeseries.doit.check = "false"
    }

    if (req.body.exercise === "Record"){
      patient.timeseries.exercise.check = "true"
      patient.timeseries.exercise.min = req.body.exercise_min_value
      patient.timeseries.exercise.max = req.body.exercise_max_value
    }else{
      patient.timeseries.exercise.check = "false"
    }

    //record.data[key].minThreshold = req.body.min_value
    //record.data[key].maxThreshold = req.body.max_value
    await patient.save();
    res.redirect("/clinicians/dashboard/" + req.params._id);
  } catch (err) {
    console.log(err);
    res.send("error happens when update timeseries");
  }
};





const renderClinicalNotes = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
    const patient = await Patient.findOne({"_id": req.params._id}).lean();  //修改成patientID
    const notes = await Note.find({ //还没建数据库
      "Patient": patient._id,
      "Doctor": doctor._id,
    }).lean();

    res.render("Clinicianclinicalnote.hbs", {notes: notes, patient: patient, doctor: doctor});
  } catch (err) {
    console.log(err);
    res.send("error happens when viewing clinicial notes");
  }
};


const addNote = async (req, res) => {
  try {
      const patient = await Patient.findById(req.params._id)
      const doctor = await Doctor.findOne({"email": req.session.userID })
      const newNote = new Note({
      Patient: req.params._id,
      Doctor: doctor._id,
      recordDate: formatDate(new Date()),
      text: req.body.notes,
    });
    console.log("addNO" + req.body.notes)
    await newNote.save();
    res.redirect("/clinicians/dashboard/" + req.params._id + "/listClinicalNotes");
  } catch (err) {
    console.log(err);
    res.send("error happens when add clinicial note");
  }
};

const viewComments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
    const patients = await Patient.find({ doctor: doctor }).lean();
    const commentList = []
    for (patient in patients) {
      let data = await Record.findOne(
        { patientId: patient._id, recordDate: formatDate(new Date()) },
        { data: true }
      ).lean();
      if (data) {
        for (key in data.data) {
          if (data.data[key].status == "recorded") {
            if(data.data[key].comment == " "){
              commentList.push({
              patientId: pat._id,
              comment: data.data[key].comment,
            })
          }
        }
      }
    }
    res.render("viewComments.hbs", {cl: commentList})  //改hbs文件名//
  }}catch (err) {
    console.log(err);
    res.send("error happens when viewing comments");
  }
}


const renderAddNote = async (req, res) => {
  // find current doctor
  const patient =  await Patient.findOne({"_id": req.params._id}).lean()
  const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
  // find all patients record (for patients who belong to the doctor )//
  res.render("ClinicianAddclinicalnotes.hbs", { patient : patient, doctor: doctor});
};

const updateNote = async (req, res) => {
  try {

    // const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
    // find all the patients belongs to this doctor
    const patient =  await Patient.findById(req.params._id)
    const note = await Note.findOne({patientId: patient._id }).lean()
    console.log(req.body.clinicalnotes)
    note.text = req.body.clinicalnotes;

    await patient.save();
    res.redirect("/clinicians/dashboard/" + req.params._id + "/clinicalNotes");
   
  } catch (err) {
    console.log(err);
    
    res.send("error happens when update note");

  }
};


function getDateList(timespan) {
  const aDay = 86400000;
  const today = Date.now();
  const dList = [];
  for (let i = 0; i < timespan; i++) {
    dList.unshift(formatDate(today - i * aDay));
  }
  return dList;
}
 
const viewChart = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({"email": req.session.userID }).lean()
    const patient = await Patient.findOne({"_id": req.params._id}).lean()
    const records = await Record.find({patientID: patient._id }).lean();
    const dList = getDateList(30);
    const dataList = { bgl: [], weight: [], doit: [], exercise: [] };
    for (date of dList) {
      // find is javscript Array.prototype function
      let record = records.find((record) => {
        return record.recordDate == date;
      });
      if (record) {
        for (key in dataList) {
          dataList[key].push(record.data[key].value);
        }
      } else {
        for (key in dataList) {
          dataList[key].push(0);
        }
      }
    }
    const pAge = age(patient.yearOfBirth)
    res.render("Clinicianviewdatachart.hbs", {
      dates: JSON.stringify(dList),
      datas: JSON.stringify(dataList),
      patient: patient,
      age: pAge,
      doctor: doctor,
    });
  } catch (err) {
    console.log(err);
    res.send("error happens in viewing history data");
  }
};




const renderCheckComment = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({"email": req.session.userID }).lean();
    const patients = await Patient.find({ doctor: doctor.userName }).lean();
    const commentList = []
    const liveAlert = liveAlert(doctor);
    for (patient of patients) {
      let data = await Record.findOne(
        { patientID: patient._id },
        { data: true }

      ).lean();

      if (data) {
        for (key in data.data) {
          if (data.data[key].status == "Recorded"){
            if (formatDate(data.data[key].createdDate) == formatDate(new Date())){
              console.log(data.data[key].comment)
              if(data.data[key].comment != "") {
                commentList.push({
                  patient: patient,
                  comment: data.data[key].comment,
                  recordDate: formatDate(new Date()),
                  data:data.data[key].name
                })
              }
            }
          }
        }
      }
    }
    res.render("ClinicianCheckComment.hbs", {cl: commentList, doctor:doctor, liveAlert:liveAlert})
  } catch (err) {
    console.log(err);
    res.send("error happens when viewing comments");
  }
}


function liveAlert(doctor){
  try {
    const patients =  Patient.find({ doctor: doctor.userName }).lean();
    const liveAlert_max = [];
    const liveAlert_min = [];
    for (patient in patients) {
      let data = Record.findOne(
        { patientId: patient._id, recordDate: formatDate(new Date()) },
        { data: true }
      ).lean();
      if (data) {
        for (key in data.data) {
          if (data.data[key].value < data.data[key].minThreshold ) {
              liveAlert_min.push({
              patient: patient,
              value: data.data[key].value,
             })
          }
          if (data.data[key].value > data.data[key].maxThreshold ) {
            liveAlert_max.push({
            patientId: patient,
            value: data.data[key].value,
           })
        }
      }
    }
  return liveAlert_min, liveAlert_max
  }}catch (err) {
    console.log(err);
    res.send("error happens for live alert");
  }
}



const logout = async (req, res) => {
  try {
    req.session.destroy(function(err){
      console.log(err)
    })

      
    res.redirect("login")
  } catch (err) {
    console.log(err);
    res.send("error happens when logout");
  }
}





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
    renderSupportMessage,
    updateSupportMessages,
    UpdateThreshold,
    renderThreshold,
    renderUpdate,
    renderClinicalNotes,
    addNote,
    viewComments,
    renderPatientData,
    ClinicianViewTable,
    renderAddNote,
    updateNote,
    viewChart,
    renderCheckComment,
    liveAlert,
    logout,

}