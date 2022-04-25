// Connect Mongoose
const mongoose = require("mongoose");

// Structure of Patient model  !ps. trim is to token the blank
const patientSchema = new mongoose.Schema({
    firstName: {type: String, required: true, lowercase: true, trim: true},
    lastName: {type: String, required: true, lowercase: true, trim: true},
    userName: {type: String, required: true, trim: true, unique: true, maxLength: 15},
    yearOfBirth: {type: Number, required: true, min: 1990, max: 2022},
    doctor: {type: String},
    email: {type: String, required: true, unique: true},
    supportMes: {type: String, required: true},
    recordRate: {type: Number, min: 0, max: 1},
    records: [{
        recordIDs: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Record"}
    }],
},
{
    timestamps: {createdAt: "Create_Time", updatedAt: "Update_Time"}
})

// Create patient model in mongodb
const Patient = mongoose.model("Patients", patientSchema);
module.exports = Patient;
