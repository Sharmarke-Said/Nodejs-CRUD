const mongoose = require("mongoose");

// Define students models
const StudentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  std_class: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  enrollmentDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", StudentsSchema);
