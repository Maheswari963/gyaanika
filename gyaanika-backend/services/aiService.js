const axios = require('axios');

// ===================================================
// HELPER — SAFE JSON PARSER
// ===================================================
function safeJSON(text) {
  if (!text) return null;

  // remove markdown
  text = text.replace(/```json|```/g, "");

  // find first JSON object
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    console.log("⚠️ NO JSON FOUND:", text);
    return null;
  }

  const jsonString = text.substring(start, end + 1);

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.log("⚠️ BROKEN JSON FIX ATTEMPT:", jsonString);

    // last repair attempt (remove trailing commas / broken quotes)
    try {
      const repaired = jsonString
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");

      return JSON.parse(repaired);
    } catch {
      return null;
    }
  }
}

// ===================================================
// GEMINI API CALL
// ===================================================
async function getCareerAnalysis(dreamPath, degree, branch) {
  console.log(`🧠 Gyaanika analysing: ${dreamPath}`);
  
  const prompt = `
    You are Gyaanika — an academic career counsellor.
    
    Student Dream Career: "${dreamPath}"
    Selected Course: ${degree} ${branch}
    
    Your job:
    1) Understand the career
    2) Detect nonsense input
    3) Check if course leads to that career
    4) Respond shortly
    
    Return STRICT JSON ONLY:
    
    {
    "type":"valid | wrong_domain | invalid_text",
    "career":"",
    "domain":"",
    "message":"short guidance for student"
    }
    
    Domains:
    Engineering → software engineer, developer, ai, data, cybersecurity
    Medical → doctor, surgeon, dentist, cardiologist
    Law → lawyer, judge
    Business → mba, marketing, finance
    Aviation → pilot
  `;

  try {
    const ai = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
      }
    );

    const text = ai.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return safeJSON(text);

  } catch (aiErr) {
    console.log("❌ GEMINI ERROR:", aiErr.response?.data || aiErr.message);
    return null;
  }
}

module.exports = { getCareerAnalysis };
