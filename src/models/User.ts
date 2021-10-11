import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: false },
});

const model = mongoose.model("User", schema);

module.exports = model;
