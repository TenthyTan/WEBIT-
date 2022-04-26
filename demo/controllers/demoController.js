// import Model
const data = require("../models/demoPatient.js");
const records = require("../models/demoRecords.js");
const { findOneAndUpdate } = require("../models/demoPatient.js");
const Patient = require("../models/patients.js");
const Record = require("../models/records.js");
const Doctor = require("../models/doctors.js");


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
    const result = await Patient.find();
    if (result.length == 0) {
      const newPatient = new Patient({
        firstName: "Pat",
        lastName: "wu",
        userName: "Pat",
        email: "pat@gmail.com",
        password: "12345678",
        yearOfBirth: "1970",
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
      patientId: patientId,
      recordDate: formatDate(new Date()),
    });
    if (!result) {
      const newRecord = new Record({
        patientId: patientId,
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
  res.render('allData.hbs', {data: Record}) // send data to browser
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
    const patientId = await initPatient();
    const recordId = await initRecord(patientId);
    // const patient = await Patient.findOne({ _id: patientId }).lean();
    const record = await Record.findOne({ _id: recordId })
      .populate({
        path: "patientId",
        options: { lean: true },
      })
      .lean();
    console.log(record);

    // console.log("-- record info when display -- ", record);
    res.render("recordData.hbs", { record: record });
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
    const record = await Record.findOne({ _id: recordId }).lean();
    const key = req.body.key
    record.data[key].value = req.body.value
    // record.data[comment].comment = req.body.comment
    // data.value = req.body.value
    // data.comment = req.body.comment
    // data.status = "recorded"
    // data.createdAt = new Date().toString
    // await data.save();
    findOneAndUpdate({}, {})
    record.save()
    console.log(record);
    res.redirect("/recordData");
  } catch (err) {
    console.log("error happens in update record: ", err);
  }
};

// handle request to get one data instance
const getDataById = (req, res) => {
    // search the database by ID
    const data = demoData.find(data => data.id === req.params.id)
        // return data if this ID exists
        if (data) {
            res.send(data)
        } else {
            // You can decide what to do if the data is not found.
            // Currently, a 404 response is sent.
            res.sendStatus(404)
    } 
}

module.exports = {
  getAllPatients,
  getOnePatient,
  addOnePatient,
  renderRecordData,
  updateRecord,
  getDataById
};




