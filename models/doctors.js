// Connect Mongoose
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// Structure of Doctor model
const doctorSchema = new mongoose.Schema({
    firstName: {type: String, required: true, lowercase: true, trim: true},
    lastName: {type: String, required: true, lowercase: true, trim: true},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, default: "doctor" },
    email: {type: String, required: true, unique: true},
    patients: [{
        patientIDs: {type: mongoose.Schema.Types.ObjectId, ref: "Patient"},
    }],
},
{
    timestamps: {createdAt: "Create_Time", updatedAt: "Update_Time"},
});

// verify passwords login

doctorSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {

        callback(err, valid);

    })
}

// Set password factor
const FACTOR = 10;

// Hash password
doctorSchema.pre('save', function save(next){
    const doctor = this;
    if(!doctor.isModified('password')){
        return next();
    }
    // calculate hash

    bcrypt.hash(doctor.password, FACTOR, (err, hash) => {
        if(err){
            return next(err);
        }
        //replace password with hash
        doctor.password = hash;
        next();
    })
})

// Create doctor model in mongodb
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;