const mongoose = require("mongoose");

const editor = new mongoose.Schema({
  type: { type: String, require: true },
  title: { type: String },
  content: { type: String },
});

const CollectionSchema = mongoose.Schema({
  title: { type: String, require: true },
  prompt: {
    type: String,
    required: true,
  },
  listing_info: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  editors: {
    type: [editor],
    required: true,
  },
  isPublished: {
    type: Boolean,
    required: true
  }
});

const Collection = mongoose.model("Collection", CollectionSchema);

module.exports = Collection;
