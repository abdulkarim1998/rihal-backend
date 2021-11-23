import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  createdOrModifiedDate: {
    type: Date,
    default: new Date(),
  },
  modified: {
    type: Boolean,
    default: false,
  },
  class: {
    type: mongoose.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  country: {
    type: mongoose.Types.ObjectId,
    ref: "Country",
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
