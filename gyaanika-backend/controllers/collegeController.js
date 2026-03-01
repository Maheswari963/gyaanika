const College = require('../models/College');
const Review = require('../models/Review');
const { getCareerAnalysis } = require('../services/aiService');

// ===================================================
// FILTER OPTIONS API
// ===================================================
exports.getFilters = async (req, res) => {
    try {
        const { district, program, degree } = req.query;

        const query = {};
        if (district) query.district = district;
        if (program) query.program = program;
        if (degree) query.degree = degree;

        const colleges = await College.find(query);

        res.json({
            districts: [...new Set(colleges.map(c => c.district).filter(Boolean))],
            programs: [...new Set(colleges.map(c => c.program).filter(Boolean))],
            degrees: [...new Set(colleges.map(c => c.degree).filter(Boolean))],
            branches: [...new Set(colleges.map(c => c.branch).filter(Boolean))]
        });

    } catch (err) {
        console.error("Filter API Error:", err);
        res.status(500).json({ error: "Failed to fetch filter options", details: err.message });
    }

};

// ===================================================
// SEARCH COLLEGES (AI ENHANCED)
// ===================================================
exports.searchColleges = async (req, res) => {
    try {
        const { district, program, degree, branch, dreamPath } = req.body;

        const query = {};
        if (district) query.district = district;
        if (program) query.program = program;
        if (degree) query.degree = degree;
        if (branch) query.branch = branch;

        let colleges = await College.find(query);

        if (!dreamPath || colleges.length === 0) {
            return res.json({
                type: "invalid_text",
                guidance: "Please enter a career goal to search.",
                colleges: []
            });
        }

        // Call AI Service
        let decision = await getCareerAnalysis(dreamPath, degree, branch);

        // ================= FALLBACK (AI FAILED) =================
        if (!decision) {
            return res.json({
                type: "valid",
                guidance: "AI temporarily unavailable — showing filtered colleges.",
                colleges: colleges
            });
        }

        // ================= REVIEW TICKET =================
        if (decision.type !== "valid") {
            await Review.create({
                collegeId: "career-validation",
                collegeName: "User Career Query",
                field: "career_path",
                issue: `User: "${dreamPath}" | AI: ${decision.message}`
            });

            return res.json({
                type: decision.type,
                guidance: decision.message,
                colleges: []
            });
        }

        // Sort by Suitability (High -> Low)
        colleges.sort((a, b) => {
            const scoreA = a.ranking?.suitability || 0;
            const scoreB = b.ranking?.suitability || 0;
            return scoreB - scoreA;
        });

        res.json({
            type: "valid",
            guidance: decision.message,
            career: decision.career,
            domain: decision.domain,
            colleges: colleges.map(c => ({
                ...c.toObject(),
                _id: c._id.toString()
            }))
        });

    } catch (err) {
        console.error("Search API Error:", err);
        res.status(500).json({
            error: "Search failed",
            details: err.message,
            guidance: "System encountered an error. Please try again."
        });
    }

};
