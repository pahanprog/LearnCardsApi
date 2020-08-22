const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    min: 6,
  },
  answer: {
    type: String,
    required: true,
    min: 6,
  },
  parent_collection: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Card", cardSchema);
