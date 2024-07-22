import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String, // This will point to the main entry file of the SCORM package
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
