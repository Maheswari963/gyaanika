const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  collegeId: String,
  collegeName: String,
  issue: String,
  field: String,
  status: { type: String, default: "pending" },
  adminFix: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);

