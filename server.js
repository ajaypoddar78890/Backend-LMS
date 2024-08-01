// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import morgan from "morgan";
// import path from "path";
// import fs from "fs";
// import unzipper from "unzipper";
// import http from "http";

// import Course from "./model/CourseSchema.js";
// import upload from "./config/multerConfig.js";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const PORT = process.env.PORT || 5500;

// const app = express();
// dotenv.config();

// app.use(morgan("dev"));
// app.use(express.json({ limit: "500mb" })); // Increase body size limit
// app.use(express.urlencoded({ limit: "500mb", extended: true })); // Increase URL-encoded body size limit
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:5500"],
//     credentials: true,
//   })
// );

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Handling file upload
// app.post("/api/uploads", upload.single("file"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded." });
//   }

//   console.log("Uploaded file:", req.file);
//   const { title, description, entryFile } = req.body;
//   const zipFilePath = path.join(__dirname, "uploads", req.file.filename);
//   const extractPath = path.join(
//     __dirname,
//     "uploads",
//     req.file.filename.replace(".zip", "")
//   );

//   try {
//     // Check if the file exists before extraction
//     if (!fs.existsSync(zipFilePath)) {
//       console.error("ZIP file does not exist:", zipFilePath);
//       return res.status(400).json({ error: "ZIP file does not exist." });
//     }

//     // Extract ZIP file
//     await new Promise((resolve, reject) => {
//       fs.createReadStream(zipFilePath)
//         .pipe(unzipper.Extract({ path: extractPath }))
//         .on("close", () => {
//           console.log("ZIP file extracted to:", extractPath);
//           resolve();
//         })
//         .on("error", (err) => {
//           console.error("Error extracting ZIP file:", err);
//           reject(err);
//         });
//     });

//     // List files in the extracted directory
//     const files = await fs.promises.readdir(extractPath);
//     console.log("Files in extracted directory:", files);

//     // Determine entry point and video URL
//     const entryPoint = entryFile || "index_lms.html";
//     const videoUrl = `/uploads/${req.file.filename.replace(
//       ".zip",
//       `/${entryPoint}`
//     )}`;
//     console.log(videoUrl);

//     // Save course details to database
//     const newCourse = new Course({
//       title,
//       description,
//       videoUrl,
//     });
//     console.log(newCourse);

//     const course = await newCourse.save();
//     console.log("Saved course:", course);

//     // Delete ZIP file after processing
//     try {
//       await fs.promises.unlink(zipFilePath);
//     } catch (err) {
//       console.error("Failed to delete ZIP file:", err);
//     }

//     res.status(201).json(course);
//   } catch (err) {
//     console.error("Error handling file upload:", err);
//     // Attempt to clean up uploaded files in case of errors
//     try {
//       await fs.promises.unlink(zipFilePath);
//     } catch (unlinkErr) {
//       console.error("Failed to delete ZIP file on error:", unlinkErr);
//     }
//     res.status(500).json({ error: "Failed to handle file upload" });
//   }
// });

// // Example of a SCORM API endpoint
// app.post("/scorm-api/save-data", (req, res) => {
//   const scormData = req.body;
//   // Validate scormData if needed
//   res.status(200).json({ message: "Data saved successfully", scormData });
// });

// const connect = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// };

// app.get("/api/courses", async (req, res) => {
//   try {
//     const courses = await Course.find({});
//     res.status(200).json(courses);
//   } catch (err) {
//     console.error("Error fetching courses:", err);
//     res.status(500).json({ error: "Error fetching courses" });
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // Create server and set timeout
// const server = http.createServer(app);

// server.listen(PORT, () => {
//   connect();
//   console.log(`Server running at http://localhost:${PORT}`);
// });

// // Set server timeout to a very large value (e.g., 10 hours)
// server.setTimeout(10 * 60 * 60 * 1000); // 10 hours

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import unzipper from "unzipper";
import http from "http";

import Course from "./model/CourseSchema.js";
import scormData from "./model/ScormDataSchema.js"; // Ensure this schema is correctly defined
import upload from "./config/multerConfig.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 5500;

const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Allow all standard HTTP methods
  })
);

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Handling file upload
app.post("/api/uploads", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  console.log("Uploaded file:", req.file);
  const { title, description, entryFile } = req.body;
  const zipFilePath = path.join(__dirname, "uploads", req.file.filename);
  const extractPath = path.join(
    __dirname,
    "uploads",
    req.file.filename.replace(".zip", "")
  );

  try {
    if (!fs.existsSync(zipFilePath)) {
      console.error("ZIP file does not exist:", zipFilePath);
      return res.status(400).json({ error: "ZIP file does not exist." });
    }

    await new Promise((resolve, reject) => {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on("close", () => {
          console.log("ZIP file extracted to:", extractPath);
          resolve();
        })
        .on("error", (err) => {
          console.error("Error extracting ZIP file:", err);
          reject(err);
        });
    });

    const files = await fs.promises.readdir(extractPath);
    console.log("Files in extracted directory:", files);

    const entryPoint = entryFile || "index_lms.html";
    const videoUrl = `/uploads/${req.file.filename.replace(
      ".zip",
      `/${entryPoint}`
    )}`;
    console.log(videoUrl);

    const newCourse = new Course({
      title,
      description,
      videoUrl,
    });
    console.log(newCourse);

    const course = await newCourse.save();
    console.log("Saved course:", course);

    try {
      await fs.promises.unlink(zipFilePath);
    } catch (err) {
      console.error("Failed to delete ZIP file:", err);
    }

    res.status(201).json(course);
  } catch (err) {
    console.error("Error handling file upload:", err);
    try {
      await fs.promises.unlink(zipFilePath);
    } catch (unlinkErr) {
      console.error("Failed to delete ZIP file on error:", unlinkErr);
    }
    res.status(500).json({ error: "Failed to handle file upload" });
  }
});

// SCORM data endpoint
app.post("/scormapi/savedata", async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || !value) {
      return res.status(400).send("Invalid SCORM data");
    }

    const newScormData = new scormData({ key, value });
    await newScormData.save();

    console.log("SCORM data saved:", newScormData);
    res.status(200).json(newScormData);
  } catch (error) {
    console.error("Error saving SCORM data:", error);
    res.status(500).send("Internal Server Error");
  }
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
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Error fetching courses" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = http.createServer(app);

server.listen(PORT, () => {
  connect();
  console.log(`Server running at http://localhost:${PORT}`);
});

server.setTimeout(10 * 60 * 60 * 1000); // 10 hours
