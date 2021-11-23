import mongoose from "mongoose";

const countrySchema = mongoose.Schema({
  countryName: {
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

const Country = mongoose.model("Country", countrySchema);

export default Country;
