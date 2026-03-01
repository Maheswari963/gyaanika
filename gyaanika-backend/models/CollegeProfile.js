const mongoose = require("mongoose");

const collegeProfileSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },

  profile: {
    overview: String,
    contact: {
      phone: String,
      website: String
    }
  },

  facts: {
    accreditation: String,
    fees: String,
    highestPackage: String,
    placementRate: String,
    nirfRank: String
  },

  career: [{ role: String, sector: String }],
  infrastructure: [{ name: String, detail: String }],
  voices: [{ user: String, batch: String, rating: Number, text: String }],

  analysis: String,

  generated: Boolean,
  lastUpdated: Date

}, { timestamps: true });

module.exports = mongoose.model("CollegeProfile", collegeProfileSchema);

