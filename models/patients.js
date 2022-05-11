// Connect Mongoose
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// Structure of Patient model  !ps. trim is to token the blank
const patientSchema = new mongoose.Schema({
  
    firstName: {type: String, required: true, lowercase: true, trim: true},
    lastName: {type: String, required: true, lowercase: true, trim: true},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    yearOfBirth: {type: Number, required: true, min: 1990, max: 2022},
    doctor: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    supportMes: {type: String, required: true},
    recordRate: {type: Number, min: 0, max: 1},
    role: { type: String, default: "patient" },
    records: [{
        recordIDs: {type: mongoose.Schema.Types.ObjectId,  ref: "Record"}
    }],
},
{
    timestamps: {createdAt: "Create_Time", updatedAt: "Update_Time"}
});

// Verify password when login
patientSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {

        callback(err, valid);

    })
}

// Set password factor
const FACTOR = 10;

// Hash password
patientSchema.pre('save', function save(next){
    const patient = this;
    if(!patient.isModified('password')){
        return next();
    }
    // calculate hash

    bcrypt.hash(patient.password, FACTOR, (err, hash) => {
        if(err){
            return next(err);
        }
        //replace password with hash
        patient.password = hash;
        next();
    })
})

// Create patient model in mongodb
const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
