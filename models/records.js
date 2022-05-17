// Connect Mongoose
const mongoose = require("mongoose");

// Structure of Record model 
const recordSchema = new mongoose.Schema({
  
    patientID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Patient"},
    recordDate: {type: String, required: true},
    data: {
        bgl: {
            name: {type: String, default: "Blood Glucose Level (nmol/L)", immutable: true},
            value: {type: Number , maxLength: 2},
            status: {type: String, enum: ["Recorded", "Unrecorded", "Not required"], default: "Unrecorded"},
            comment: {type: String, default: " "},
            createdDate: {type: Date},
            minThreshold: {type: Number, default: 0},
            maxThreshold: {type: Number, default: 20},
        },
        doit: {
            name: {type: String, default: "Insulin Taken (units)", immutable: true},
            value: {type: Number,  maxLength: 3, min: 0, max: 500},
            status: {type: String, enum: ["Recorded", "Unrecorded", "Not required"], default: "Unrecorded"},
            comment: {type: String, default: " "},
            createdDate: {type: Date},
            minThreshold: {type: Number, default: 0},
            maxThreshold: {type: Number, default: 3},
        },
        weight: {
            name: {type: String, default: "Weight (kg)", immutable: true},
            value: {type: Number,  min: 0, max: 500},
            status: {type: String, enum: ["Recorded", "Unrecorded", "Not required"], default: "Unrecorded"},
            comment: {type: String, default: " "},
            createdDate: {type: Date},
            minThreshold: {type: Number, default: 60},
            maxThreshold: {type: Number, default: 80},
        },
        exercise: {
            name: {type: String, default: "Exercise (steps)", immutable: true},
            value: {type: Number},
            status: {type: String, enum: ["Recorded", "Unrecorded", "Not required"], default: "Unrecorded"},
            comment: {type: String, default: " "},
            createdDate: {type: Date},
            minThreshold: {type: Number, default: 500},
            maxThreshold: {type: Number, default: 1000},
        },

    },
});

// Create record model in mongodb
const Record = mongoose.model("Record", recordSchema);
module.exports = Record;