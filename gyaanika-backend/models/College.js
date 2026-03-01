const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: String,
  district: String,
  program: String,
  degree: String,
  branch: String,
  location: String,

  type: String, // e.g. "Government", "Private", "Deemed"
  alumni: [String], // e.g. ["Google", "Microsoft"]

  ranking: {
    avgPackage: String,
    suitability: Number,
    statusBadges: [String]
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

  generated: Boolean,
  lastUpdated: Date

}, {
  timestamps: true,
});

module.exports = mongoose.model("College", collegeSchema);

