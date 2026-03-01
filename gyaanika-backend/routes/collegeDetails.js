const express = require("express");
const router = express.Router();
const College = require("../models/College");
const CollegeProfile = require("../models/CollegeProfile");
const axios = require("axios");

// ================= SAFE JSON =================
function safeJSON(text) {
  if (!text) return null;

  text = text.replace(/```json|```/g, "").trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;

  try {
    return JSON.parse(text.substring(start, end + 1));
  } catch {
    return null;
  }
}

// ================= AI GENERATOR =================
async function generateCollegeProfile(college, dream) {
  const prompt = `
You are Gyaanika AI.

College: ${college.name}
Location: ${college.location}
Branch: ${college.branch}
Student Dream: ${dream}

Return STRICT JSON:

{
 "deepAnalysis": {
   "match": "1-2 professional sentences explaining suitability score and neural alignment.",
   "career": "1-2 professional sentences predicting career trajectory and placement vectors.",
   "roi": "1-2 professional sentences on estimated ROI and financial yield."
 },
 "infrastructure": [
   {"name":"Modern Labs","detail":"Advanced computing labs with AI tools."}
 ],
 "voices":[
   {"user":"Student A","batch":"2024","rating":5,"text":"Excellent academics and placement support."}
 ]
}
`;

  try {
    const ai = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1500 }
      }
    );

    const text = ai.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return safeJSON(text);

  } catch (err) {
    console.log("Gemini Error:", err.message);
    return null;
  }
}

// ================= DETAILS ROUTE =================
router.get("/:id", async (req, res) => {
  try {
    const dream = req.query.dream || "technology career";

    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ error: "Not found" });

    let profile = await CollegeProfile.findOne({
      collegeId: college._id
    });

    // 🔥 ALWAYS GENERATE IF MISSING ANALYSIS
    if (!profile || !profile.deepAnalysis || !profile.deepAnalysis.match) {
      const aiData = await generateCollegeProfile(college, dream);

      if (aiData) {
        if (!profile) {
          profile = await CollegeProfile.create({
            collegeId: college._id,
            deepAnalysis: aiData.deepAnalysis,
            infrastructure: aiData.infrastructure,
            voices: aiData.voices,
            generated: true,
            lastUpdated: new Date()
          });
        } else {
          profile.deepAnalysis = aiData.deepAnalysis;
          profile.infrastructure = aiData.infrastructure;
          profile.voices = aiData.voices;
          profile.generated = true;
          profile.lastUpdated = new Date();
          await profile.save();
        }
      }
    }

    const combined = {
      ...college.toObject(),
      ...(profile ? profile.toObject() : {})
    };

    res.json(combined);

  } catch (err) {
    console.error("Details Error:", err);
    res.status(500).json({ error: "Failed to load details" });
  }
});

module.exports = router;
