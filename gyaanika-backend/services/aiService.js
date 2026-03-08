const axios = require("axios");

// ===================================================
// SAFE JSON PARSER
// ===================================================
function safeJSON(text) {
  if (!text) return null;

  text = text.replace(/```json|```/g, "");

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    console.log("⚠️ No JSON found:", text);
    return null;
  }

  const jsonString = text.substring(start, end + 1);

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    try {
      const repaired = jsonString
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");

      return JSON.parse(repaired);
    } catch {
      console.log("⚠️ JSON repair failed");
      return null;
    }
  }
}


// ===================================================
// AI CAREER ANALYZER
// ===================================================
async function getCareerAnalysis(dreamPath, degree, branch) {

  console.log(`🧠 Gyaanika analysing career: ${dreamPath}`);

  const prompt = `
You are Gyaanika — an intelligent academic career counsellor.

Student dream career: "${dreamPath}"
Selected course: ${degree} ${branch}

Tasks:
1. Understand the career goal.
2. Detect nonsense or unrealistic career text.
3. Check if the selected course can realistically lead to that career.
4. If mismatch, explain briefly and suggest better paths.

Domains reference:

Engineering:
software engineer, developer, AI engineer, data scientist,
robotics engineer, cybersecurity

Medical:
doctor, surgeon, dentist, cardiologist, neurologist

Law:
lawyer, judge, legal advisor

Business:
entrepreneur, marketing manager, finance analyst, MBA careers

Aviation:
pilot, airline captain

Architecture:
architect (requires BArch)

Return STRICT JSON ONLY:

{
"type": "valid | wrong_domain | invalid_text",
"career": "",
"domain": "",
"message": "",
"suggested_degrees": [],
"suggested_branches": []
}
`;

  try {

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 400
        }
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const parsed = safeJSON(text);

    if (!parsed) {
      return {
        type: "error",
        message: "AI response could not be parsed"
      };
    }

    return parsed;

  } catch (err) {

    console.log("❌ Gemini API Error:", err.response?.data || err.message);

    return {
      type: "error",
      message: "AI service unavailable"
    };
  }
}

module.exports = { getCareerAnalysis };
