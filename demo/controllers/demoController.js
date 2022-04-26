// import Model
//const data = require("../models/demoPatient.js");
//const records = require("../models/demoRecords.js"); 不需要demo了
const { findOneAndUpdate } = require("../models/patient.js");
const Patient = require("../models/patients.js");
const Record = require("../models/records.js");
const Doctor = require("../models/doctors.js");

//写日期//
function formatDate(date) {
  var d = new Date(date), //creat a new data
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-"); //return as 2002-06-09
}

//如果patient不在database里面，则创建新patient。如果有则返回这个patient。//
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
    console.log("Error", err);
  }
}
//如果病人今天没记录数据，则创建新数据。如果病人已经记录数据了，那返回已经记录的数据的id（当天的数据）//
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

//在hbs中填充record的数据//
const getAllPatients = (req, res) => {
  res.render('allData.hbs', {data: Record, patient: Patient}) // send data to browser
}

//通过patient id 找patient的信息//
const getOnePatient = (req, res) => {
  const patient = Record.find((one) => one.id == req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.send("patient not found");
  }
};

////
const addOnePatient = (req, res) => {
  // console.log(req.rawHeaders.toString());
  const newPatient = req.body;
  if (JSON.stringify(newPatient) != "{}") {
    // console.log(data.find(d => d.id == newPatient.id));
    if (!Record.find((d) => d.id == newPatient.id)) {
      Record.push(newPatient);
    }
  }
  res.send(Record);
};

////
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
    res.render("recordData.hbs", { record: Record });
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
    const data = Record.find(data => data.id === req.params.id)
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




