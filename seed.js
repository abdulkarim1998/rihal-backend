import mongoose from "mongoose";
import Country from "./models/country.js";
import Class from "./models/class.js";
import Student from "./models/student.js";

mongoose
  .connect("mongodb://localhost:27017/school", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {})
  .catch((err) => {});

const generateClass = async (className) => {
  await new Class({
    className: className,
  }).save();
};

const generateCountry = async (countryName) => {
  await new Country({
    countryName: countryName,
  }).save();
};

const firstClassId = async () => {
  const firstClass = await Class.findOne();
  return firstClass._id.toString();
};

const firstCountryId = async () => {
  const country = await Country.findOne();
  return country._id.toString();
};

const generateStudent = async (studentName, dateOfBirth) => {
  try {
    const classId = await firstClassId();
    const countryId = await firstCountryId();

    const newStudent = await new Student({
      studentName: studentName,
      dateOfBirth: new Date(dateOfBirth),
      class: mongoose.Types.ObjectId(classId),
      country: mongoose.Types.ObjectId(countryId),
    }).save();

    await Class.findByIdAndUpdate(classId, {
      $push: { students: mongoose.Types.ObjectId(newStudent._id) },
    });
    await Country.findByIdAndUpdate(countryId, {
      $push: { students: mongoose.Types.ObjectId(newStudent._id) },
    });
  } catch (error) {}
};

const generate = async () => {
  await generateClass("Math 342").then().catch();
  await generateClass("Science 444").then().catch();
  await generateClass("Java 999").then().catch();

  await generateCountry("Oman").then().catch();
  await generateCountry("Australia").then().catch();
  await generateCountry("New Zealand").then().catch();

  await generateStudent("Mohammad Abdul", "1990-02-02").then().catch();
  await generateStudent("John Smith", "1996-03-29").then().catch();
  await generateStudent("Pale King", "1995-02-02").then().catch();
  await generateStudent("Link", "1994-02-02").then().catch();
  await generateStudent("Arthur Morgan", "1995-04-02").then().catch();
  await generateStudent("Jonathan Joestar", "2000-12-02").then().catch();
};

export default generate;
