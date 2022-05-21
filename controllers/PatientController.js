// import Model
const mongoose = require("mongoose");
const { findOneAndUpdate } = require("../models/records.js");
const Patient = require("../models/patients.js");
const Record = require("../models/records.js");
const Doctor = require("../models/doctors.js");
const bcrypt = require("bcrypt");


function formatDate(date) {
  var d = new Date(date), //creat a new data
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-"); //return as 2002-06-09
}

async function initPatient() {
  try {
    // find all document in Patient Collection to findout if it is empty

    //const hash = await bcrypt.hash('12345678', 10)
    const result = await Patient.find();
    if (result.length == 0) {
      const newPatient = new Patient({
        firstName: "pat",
        lastName: "wu",
        userName: "Pat",
        password : "12345678",
        email: "pat@gmail.com",
        doctor: "chirs",
        yearOfBirth: "1991",
        supportMes: "You are the best",
        
      });
      // save new patient to database
      const patient = await newPatient.save();
      // console.log("-- id is: ", patient.id);
      return patient.id;
    } else {
      // find our target patient Pat
      const patient = await Patient.findOne({ firstName: "pat" });
      // console.log("-- id is: ", patient.id);
      return patient.id;
    }
  } catch (err) {
    console.log("error happens in patient initialisation: ", err);
  }
}

async function initRecord(patientId) {
  try {
    const patient = await Patient.findById(patientId);
    const oldResult = await Record.findOne({
      patientID: patientId,
      recordDate: formatDate(new Date()),
    });
    
    if (!oldResult) {
      const newRecord = new Record({
        patientID: patientId,
        recordDate: formatDate(new Date()),
        data: await checkStatus(patientId)        
      });
      const record = await newRecord.save();
      // Insert record to patient record list
      console.log("new: " + record)
      patient.records.push({recordIDs: record._id})
      return record.id;
    } else {
      return oldResult.id;
    }
  } catch (err) {
    console.log("error happens in record initialisation: ", err);
  }
}

async function checkStatus(patientId) {
  //copy timeseries
  const timeseries = (await Patient.findOne({"_id": patientId}).lean()).timeseries;
  const data = {};
  for (key in timeseries) {
    data[key] = {};
    if (timeseries[key].check === false ) {
      data[key].status = "Not required";
      data[key].minThreshold = 0;
      data[key].maxThreshold = 0;
    } else {
      data[key].status = "Unrecorded";
      data[key].minThreshold = timeseries[key].min;
      data[key].maxThreshold = timeseries[key].max;
    }
  }
  return data;
}


const getOnePatient = (req, res) => {
  const patient = data.find((one) => one.id == req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.send("patient not found");
  }
};

const addOnePatient = (req, res) => {
  // console.log(req.rawHeaders.toString());
  const newPatient = req.body;
  if (JSON.stringify(newPatient) != "{}") {
    // console.log(data.find(d => d.id == newPatient.id));
    if (!data.find((d) => d.id == newPatient.id)) {
      data.push(newPatient);
    }
  }
  res.send(data);
};

const renderRecordData = async (req, res) => {
  try {
    const patient = await Patient.findOne({"email": req.session.userID}).lean()
    const recordId = await initRecord(patient._id);
    // const patient = await Patient.findOne({ _id: patientId }).lean();
    const record = await Record.findOne({ _id: recordId })
      .populate({
        path: "patientID",
        options: { lean: true },
      })
      .lean();
    res.render("Patientrecorddata.hbs", { record: record, patient: patient });
  } catch (err) {
    res.status(400);
    res.send("error happens when render record data");
  }
};

const updateRecord = async (req, res) => {
  console.log("-- req form to update record -- ", req.body);
  try {
    const patient = await Patient.findOne({"email": req.session.userID}).lean()
    const recordId = await initRecord(patient._id);
    const record = await Record.findOne({ _id: recordId })
    const key = req.body.key
    record.data[key].value = req.body.value
    record.data[key].comment = req.body.comment
    record.data[key].status = "Recorded"
    record.data[key].createdDate = new Date()

    await record.save();
    res.redirect("/patients/recordData");
  } catch (err) {
    console.log("error happens in update record: ", err);
  }
};


const getAllRecords = async(req, res) => {
  try{
    const patientId = await initPatient();
    const recordId = await initRecord(patientId);
    const record = await Record.findOne({ _id: recordId })
      .populate({
        path: "patientID",
        options: { lean: true },
      })
      .lean();
  res.render('Cliniciandashboard.hbs', {record: record});
  }catch(err){
    console.log("error happens ", err);

  }
}

const renderHomePage = async (req, res) => {
  try{
    const patient = await Patient.findOne({"email": req.session.userID}).lean()
    res.render("PatientHome.hbs", {patient: patient})
  }catch(err){
    console.log(err)
    res.send("error happens when render patient homepage");
  }
  
};

const renderLoginPage = async (req, res) => {
  try{
   res.render("Patientslogin.hbs", req.session.flash);
  }catch(err){
    console.log(err)
    res.send("error happens when render patient login page");
  }
};

function age(birth) {

  const d = new Date()
  const year = d.getFullYear()
  const age = String(year - birth)
  const data = {
    "age": age
  }
  return data
}

const renderProfile = async (req, res) => {
  try{
    const patient = await Patient.findOne({"email": req.session.userID}).lean()
    const data = age(patient.yearOfBirth)
    res.render("Patientprofile.hbs", { patient: patient, data: data });
  }catch(err){
    console.log(err)
    res.send("error happens when render patient profile");
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
    const patient = await Patient.findOne({"email": req.session.userID}).lean()
    const records = await Record.find({ patientID: patient._id }).lean();
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
    res.render("Patientviewdatachart.hbs", {
      dates: JSON.stringify(dList),
      datas: JSON.stringify(dataList),
      patient: patient,
      age: pAge
    });
  } catch (err) {
    console.log(err);
    res.send("error happens in viewing history data");
  }
};

const viewTable = async (req, res) => {

  const patient = await Patient.findOne({"email": req.session.userID}).lean()
  const records = await Record.find({ "patientID": patient._id }).lean();
  const pAge = age(patient.yearOfBirth);
  console.log({records});
  res.render("Patientviewdata.hbs", { patient : patient, record: records, age: pAge});
}

function checkRecorded(record) {
  var flag = false;
  for (key in record.data) {
    if (record.data[key].status == "Recorded") {
      flag = true;
    }
  }
  return flag;
}

async function engageRate(patientID) {
  const records = (await Record.find({ "patientID": patientID }).lean()).filter(
    (record) => checkRecorded(record)
  );
  const patient = await Patient.findById(patientID);
  const start = new Date(formatDate(patient.Create_Time)).getTime();
  const today = new Date(formatDate(Date.now())).getTime();
  const period = (today - start) / (24 * 60 * 60 * 1000) + 1;
  patient.recordRate = (records.length / period).toFixed(3);
  await patient.save();
}

const rankBoard = async (req, res) => {
  try{
    const p = await Patient.findOne({"email": req.session.userID}).lean()
    const start = new Date(formatDate(p.Create_Time)).getTime();
    const today = new Date(formatDate(Date.now())).getTime();
    const day = (today - start) / (24 * 60 * 60 * 1000) + 1;
    const patients = await Patient.find({}, {});

    for (patient of patients) {
      await engageRate(patient._id);
    }
    var pList = await Patient.find({}, {}).lean();
    pList = pList
      .sort((a, b) => {
        return b.recordRate - a.recordRate;
      })
      .slice(0, 5);
    res.render("PatientRank.hbs", { rank: pList, patient: p, day: day});
  }catch(err){
    console.log("rank board error happens ", err);
  }
};


const changePassword = async(req, res) => {
  try{
    // find current patient
    const patient = await Patient.findOne({"email": req.session.userID}).lean()
  
    if (!await bcrypt.compare(req.body.oldPassword, patient.password)){
      console.log("The old password is not correct")
      return res.render("patientChangePassword.hbs", {
          patient: patient,
          input: req.body,
          message: "The old password is incorrect, please try again",
      });
    }else if (!(req.body.newPassword === req.body.confirmPassword)){
      console.log("not same password")
      return res.render("patientChangePassword.hbs", {
          patient: patient,
          input: req.body,
          message: "The password is not the same, please try again",
      });
    } else if ((req.body.oldPassword === req.body.newPassword)){
      console.log("the old psd is same as new password")
      return res.render("patientChangePassword.hbs", {
          patient: patient,
          input: req.body,
          message: "The old password is the same as the new password, please try again",
      });
    }
      const p = await Patient.findById(patient._id)
      p.password = req.body.newPassword
      await p.save()
      //Doctor.findOneAndUpdate({email: req.session.userID},{password: req.body.newPassword})
      return res.render("patientChangePassword.hbs", {
        patient: patient,
        input: req.body,
        message: "Update successfully!",
    }); 
   
  }catch(err){
    console.log("error happens ", err);

  }
}

const renderUpdate = async(req, res) => {
  try{
   const patient = await Patient.findOne({"email": req.session.userID}).lean()
   res.render('PatientChangePassword.hbs', {patient: patient}); // send data to browser
  }catch(err){
    console.log("error happens ", err);

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
  getOnePatient,
  addOnePatient,
  renderRecordData,
  updateRecord,
  getAllRecords,
  renderHomePage,
  renderLoginPage,
  renderProfile,
  viewChart,
  viewTable,
  rankBoard,
  changePassword,
  renderUpdate,
  logout,
};



