const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log("--- SYSTEM CHECK ---");
console.log("Key Found:", process.env.GEMINI_API_KEY ? "YES" : "NO");
console.log("Key Starts With:", process.env.GEMINI_API_KEY?.substring(0, 7));
console.log("ADMIN:", process.env.ADMIN_USER, process.env.ADMIN_PASS);
console.log("--------------------");

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to Gyaanika Cloud (Atlas)"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ROUTES
const collegeDetailsRoute = require("./routes/collegeDetails");
const adminRoutes = require("./routes/adminRoutes");
const collegeController = require("./controllers/collegeController");

const contextController = require("./controllers/contextController");

app.use("/api/college-details", collegeDetailsRoute);
app.use("/api/admin", adminRoutes);

// UNIFIED CONTEXT API (The "1-Call" Endpoint)
app.get('/api/context', contextController.getContext);

// COLLEGE ROUTES
// Moved logic to controllers/collegeController.js
app.get('/api/filters', collegeController.getFilters);
app.post('/api/search-colleges', collegeController.searchColleges);
// Serve built frontend
app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Gyaanika Server running on port ${PORT}`));

