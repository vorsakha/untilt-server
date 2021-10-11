import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String, required: true },
  steps: { type: String, required: true },
  priority: { type: Number, required: true },
  assigned: { type: String, required: true },
  version: { type: String, required: true },
  status: { type: String },
  date: { type: Date, default: Date.now },
});

const model = mongoose.model("Bug", schema);

module.exports = model;
