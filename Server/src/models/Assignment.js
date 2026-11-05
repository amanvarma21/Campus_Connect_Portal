const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["Pending", "Submitted"],
    default: "Pending"
  },
  dueDate: { type: String, required: true, trim: true }
});

module.exports = mongoose.models.Assignment ||
  mongoose.model("Assignment", assignmentSchema);