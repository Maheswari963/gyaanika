const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

console.log("=== GYAANIKA SERVER START ===");

app.use(cors());
app.use(express.json());

// ================= DATABASE =================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Mongo Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

// ================= ROUTES =================
const collegeController = require("./controllers/collegeController");
const collegeDetailsRoute = require("./routes/collegeDetails");

// API ROUTES
app.get("/api/filters", collegeController.getFilters);
app.post("/api/search-colleges", collegeController.searchColleges);
app.use("/api/college-details", collegeDetailsRoute);

// ================= FRONTEND SERVE =================
// IMPORTANT: Serve frontend dist from correct folder
app.use(express.static(path.join(__dirname, "../gyaanika-frontend/dist")));

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../gyaanika-frontend/dist/index.html")
  );
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
