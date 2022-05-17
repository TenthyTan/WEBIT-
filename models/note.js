const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    recordDate: {type: String, required: true},
    Patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    Doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,

    },
    text: { type: String },
  },
  {
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }

);

// create collection notes in mongodb
const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
