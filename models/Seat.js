const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;

// Create Schema
const SeatSchema = new Schema({
  current: {
    type: Number,
    required: true,
    default: 1
  },
  capacity: {
    type: Number,
    required: false,
    default: 500
  }
});

SeatSchema.plugin(timestamps);

module.exports = Seat = mongoose.model("seats", SeatSchema);
