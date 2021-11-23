import mongoose from "mongoose";

const classSchema = mongoose.Schema({
  className: {
    type: String,
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
  students: {
    type: [mongoose.Types.ObjectId],
    ref: "Student",
  },
});

const Class = mongoose.model("Class", classSchema);

export default Class;
