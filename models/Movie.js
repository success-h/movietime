const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;

// Create Schema
const MovieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  runtime: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true
  }
});

MovieSchema.plugin(timestamps)

module.exports = Movie = mongoose.model("movies", MovieSchema);
