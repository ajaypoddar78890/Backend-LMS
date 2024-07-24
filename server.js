import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import unzipper from "unzipper";

import Course from "./model/CourseSchema.js"; // Use default import for Course
import upload from "./config/multerConfig.js"; // Import the multer configuration
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5500;

// Config
const app = express();
dotenv.config();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5500"],
    credentials: true,
  })
);

// Serving the static filess
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.post("/api/uploads", upload.single("file"), (req, res) => {
  try {
    const { title, description, entryFile } = req.body;
    const zipFilePath = path.join(__dirname, "uploads", req.file.filename);
    const extractPath = path.join(
      __dirname,
      "uploads",
      req.file.filename.replace(".zip", "")
    );

    // Extract the ZIP file
    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on("close", async () => {
        try {
          // Use the provided entry file or default to index.html
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

          // Clean up the ZIP file
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

// Connecting to the DB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Routes
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
