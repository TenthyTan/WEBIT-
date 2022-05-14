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

    const hash = bcrypt.hash("12345678", 10);
    const result = await Patient.find();
    if (result.length == 0) {
      const newPatient = new Patient({
        firstName: "Pat",
        lastName: "wu",
        userName: "Pat",
        password: hash,
        email: "pat@gmail.com",
        doctor: "Chirs",
        yearOfBirth: "1991",
        supportMes: "You are the best",
      });

      // save new patient to database
      const patient = await newPatient.save();
      // console.log("-- id is: ", patient.id);

      return patient.id;
    } else {
      // find our target patient Pat
      const patient = await Patient.findOne({ firstName: "Pat" });
      // console.log("-- id is: ", patient.id);
      return patient.id;
    }
  } catch (err) {
    console.log("error happens in patient initialisation: ", err);
  }
}

async function initRecord(patientId) {
  try {
    const result = await Record.findOne({
      patientID: patientId,
      recordDate: formatDate(new Date()),
    });
    if (!result) {
      const newRecord = new Record({
        patientID: patientId,
        recordDate: formatDate(new Date()),
      });

      const record = await newRecord.save();
      return record.id;
    } else {
      return result.id;
    }
  } catch (err) {
    console.log("error happens in record initialisation: ", err);
  }
}

const getAllPatients = (req, res) => {
  //res.render('Cliniciandashboard.hbs', {record: Record.lean(), Patient: Patient.lean()}) // send data to browser
};

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

const updateRecord = async (req, res) => {
  console.log("-- req form to update record -- ", req.body);
  try {
    const patientId = await initPatient();
    const recordId = await initRecord(patientId);
    const record = await Record.findOne({ _id: recordId });
    const key = req.body.key;
    record.data[key].value = req.body.value;
    record.data[key].comment = req.body.comment;
    // data.value = req.body.value
    // data.comment = req.body.comment
    record.data[key].status = "Recorded";
    record.data[key].createdDate = new Date();
    // await data.save();
    // Record.findOneAndUpdate({}, {});
    await record.save();
    console.log(record);
    res.redirect("/patients/recordData");
  } catch (err) {
    console.log("error happens in update record: ", err);
  }
};

// handle request to get one data instance
const getDataById = (req, res) => {
  // search the database by ID
  const data = Record.find((data) => data.id === req.params.id);
  // return data if this ID exists
  if (data) {
    res.send(data);
  } else {
    // You can decide what to do if the data is not found.
    // Currently, a 404 response is sent.
    res.sendStatus(404);
  }
};

const getAllRecords = async (req, res) => {
  try {
    const patientId = await initPatient();
    const recordId = await initRecord(patientId);
    const record = await Record.findOne({ _id: recordId })
      .populate({
        path: "patientID",
        options: { lean: true },
      })
      .lean();

    res.render("Cliniciandashboard.hbs", { record: record }); // send data to browser
  } catch (err) {
    console.log("error happens ", err);
  }
};

const renderHomePage = async (req, res) => {
  res.render("PatientHome.hbs");
};

const renderPatientData = async (req, res) => {
  const record = {
    recordDate: "2022-05-14",
    data: {
      mock: [
        {
          date: "2022-03-11",
          bgl: "424",
          doit: "3213",
          weight: 155,
          exercise: 42343,
        },
        {
          date: "2022-03-12",
          bgl: "424",
          doit: "3213",
          weight: 124,
          exercise: 42343,
        },
        {
          date: "2022-03-13",
          bgl: "424",
          doit: "3213",
          weight: 152,
          exercise: 42343,
        },
        {
          date: "2022-03-14",
          bgl: "424",
          doit: "3213",
          weight: 133,
          exercise: 42343,
        },
        {
          date: "2022-03-15",
          bgl: "424",
          doit: "3213",
          weight: 166,
          exercise: 42343,
        },
        {
          date: "2022-03-16",
          bgl: "424",
          doit: "3213",
          weight: 169,
          exercise: 42343,
        },
        {
          date: "2022-03-17",
          bgl: "424",
          doit: "3213",
          weight: 155,
          exercise: 42343,
        },
      ],
      bgl: {
        name: "Blood Glucose Level (nmol/L)",
        status: "Unrecorded",
        comment: " 123",
        minThreshold: 0,
        maxThreshold: 20,
      },
      doit: {
        name: "Insulin Taken (units)",
        status: "Unrecorded",
        comment: "432 ",
        minThreshold: 0,
        maxThreshold: 3,
      },
      weight: {
        name: "Weight (kg)",
        status: "Unrecorded",
        comment: " 423",
        minThreshold: 60,
        maxThreshold: 80,
      },
      exercise: {
        name: "Exercise (steps)",
        status: "Not required",
        comment: " 42",
        minThreshold: 500,
        maxThreshold: 1000,
      },
    },
  };

  res.render("Patientviewdata.hbs", { record: record });
};

const renderLoginPage = async (req, res) => {
  res.render("Patientslogin.hbs", req.session.flash);
};

<<<<<<< HEAD
=======
const renderProfile = async (req, res) => {
  
  const patient = await Patient.findOne({"userName": req.session.useName})
  res.render("Patientprofile.hbs", {patient: patient});
 
};


>>>>>>> a55b302ba430fd5060a887d7af0ad1059666dc04
module.exports = {
  getAllPatients,
  getOnePatient,
  addOnePatient,
  renderRecordData,
  updateRecord,
  getDataById,
  getAllRecords,
  renderHomePage,
  renderLoginPage,
<<<<<<< HEAD
  renderPatientData,
=======
  renderProfile
>>>>>>> a55b302ba430fd5060a887d7af0ad1059666dc04
};
