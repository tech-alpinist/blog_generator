const mongoose = require("mongoose");

const editor = new mongoose.Schema({
  type: { type: String, require: true },
  title: { type: String },
  content: { type: String },
});

const TemplateSchema = mongoose.Schema({
  name: { type: String, require: true },
  prompt: {
    type: String,
    required: true,
  },
  editors: {
    type: [editor],
    required: true,
  },
});

const Template = mongoose.model("Template", TemplateSchema);

module.exports = Template;
