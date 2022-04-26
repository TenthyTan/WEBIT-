// Connect Mongoose
const mongoose = require("mongoose");

// Structure of Doctor model
const doctorSchema = new mongoose.Schema({
    firstName: {type: String, required: true, lowercase: true, trim: true},
    lastName: {type: String, required: true, lowercase: true, trim: true},
    userName: {type: String, required: true, trim: true, unique: true, maxLength: 15},
    email: {type: String, required: true, unique: true},
    patients: [{
        patientIDs: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Patient"},
    }],
},
{
    timestamps: {createdAt: "Create_Time", updatedAt: "Update_Time"},
});

// Create doctor model in mongodb
const Doctor = mongoose.model("Doctor", doctorSchema);
module,exports = Doctor;