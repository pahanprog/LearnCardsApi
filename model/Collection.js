const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 6,
  },
  description: {
    type: String,
    required: true,
    min: 6,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Collection", collectionSchema);
