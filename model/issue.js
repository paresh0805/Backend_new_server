import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  report: String,
  location: String,
  status: String,
  priority: String,
  department: String,
  assigned: String,
  date: String,
  issue: String,
  shortInfo: String,
  reporter: String,
  photo: String,
  estimatedResolution: String,
  updatedStatus: String,
  estimatedCost: String,
  internalNotes: String,
});

export default mongoose.model("Issue", issueSchema); // Mongoose auto uses 'issues' collection
