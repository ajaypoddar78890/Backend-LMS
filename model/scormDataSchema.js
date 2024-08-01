import mongoose from "mongoose";

const scormDataSchema = new mongoose.Schema({
  key: String,
  value: String,
});

const ScormData = mongoose.model("ScormData", scormDataSchema);
export default ScormData;
