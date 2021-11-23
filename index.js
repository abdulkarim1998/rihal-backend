import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Class from "./models/class.js";
import Student from "./models/student.js";
import Country from "./models/country.js";
import generate from "./seed.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected");

    mongoose.connection.db
      .collection("countries")
      .count()
      .then(async (data) => {
        if (data == 0) {
          await generate();
        }
      });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Greetings");
});

// Students api
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/students", async (req, res) => {
  const { class: classID, country } = req.body;
  const newStudent = new Student(req.body);

  if (!mongoose.Types.ObjectId.isValid(classID)) return res.json("not valid");
  if (!mongoose.Types.ObjectId.isValid(country)) return res.json("not valid");
  try {
    await newStudent.save();
    await Class.findByIdAndUpdate(classID, {
      $push: { students: mongoose.Types.ObjectId(newStudent._id) },
    });
    await Country.findByIdAndUpdate(country, {
      $push: { students: mongoose.Types.ObjectId(newStudent._id) },
    });
    res.status(200).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/students/:id", async (req, res) => {
  const { id } = req.params;
  req.body.createdOrModifiedDate = new Date();
  req.body.modified = true;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.json("not valid");
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.json("not valid");

  try {
    await Student.findByIdAndRemove(id);
    res.status(200).json({ message: "Student deleted sucessfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Classes api

app.get("/classes", async (req, res) => {
  try {
    const classes = await Class.find();

    res.status(200).json(classes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/classes", async (req, res) => {
  const newClass = new Class(req.body);

  try {
    await newClass.save();
    res.status(200).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/classes/:id", async (req, res) => {
  const { id } = req.params;
  req.body.createdOrModifiedDate = new Date();
  req.body.modified = true;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.json("not valid");
  try {
    const updatedClass = await Class.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/classes/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.json("not valid");

  try {
    await Class.findByIdAndRemove(id);
    res.status(200).json({ message: "Class deleted sucessfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Country api

app.get("/countries", async (req, res) => {
  try {
    const countries = await Country.find();

    res.status(200).json(countries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/countries", async (req, res) => {
  const newCountry = new Country(req.body);

  try {
    await newCountry.save();
    res.status(200).json(newCountry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/countries/:id", async (req, res) => {
  const { id } = req.params;
  req.body.createdOrModifiedDate = new Date();
  req.body.modified = true;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.json("not valid");
  try {
    const updatedCountry = await Country.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCountry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/countries/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.json("not valid");

  try {
    await Country.findByIdAndRemove(id);
    res.status(200).json({ message: "Country deleted sucessfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log("server Running");
});
