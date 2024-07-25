import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import unzipper from "unzipper";

import Course from "./model/CourseSchema.js";
import upload from "./config/multerConfig.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 5500;

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5500"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Handling file upload
app.post("/api/uploads", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    console.log("Uploaded file:", req.file); // Debug log
    const { title, description, entryFile } = req.body;
    const zipFilePath = path.join(__dirname, "uploads", req.file.filename);
    const extractPath = path.join(
      __dirname,
      "uploads",
      req.file.filename.replace(".zip", "")
    );

    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("close", async () => {
        try {
          const entryPoint = entryFile || "index_lms.html";
          const videoUrl = `/uploads/${req.file.filename.replace(
            ".zip",
            `/${entryPoint}`
          )}`;

          const newCourse = new Course({
            title,
            description,
            videoUrl,
          });

          const course = await newCourse.save();

          fs.unlink(zipFilePath, (err) => {
            if (err) console.error("Failed to delete ZIP file:", err);
          });

          res.status(201).send(course);
        } catch (err) {
          console.error("Failed to save course:", err);
          res.status(500).send({ error: "Failed to save course" });
        }
      })
      .on("error", (err) => {
        console.error("Failed to extract ZIP file:", err);
        res.status(500).send({ error: "Failed to extract ZIP file" });
      });
  } catch (err) {
    console.error("Error handling upload:", err);
    res.status(500).send({ error: "Error handling upload" });
  }
});

// Example of a SCORM API endpoint
app.post("/scorm-api/save-data", (req, res) => {
  const scormData = req.body;
  res.status(200).send({ message: "Data saved successfully", scormData });
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).send(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).send({ error: "Error fetching courses" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  connect();
  console.log(`Server running at http://localhost:${PORT}`);
});
