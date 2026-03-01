const College = require("../models/College");

// ================= GET FILTERS =================
exports.getFilters = async (req, res) => {
  try {
    const colleges = await College.find();

    res.json({
      districts: [...new Set(colleges.map(c => c.district).filter(Boolean))],
      programs: [...new Set(colleges.map(c => c.program).filter(Boolean))],
      degrees: [...new Set(colleges.map(c => c.degree).filter(Boolean))],
      branches: [...new Set(colleges.map(c => c.branch).filter(Boolean))]
    });

  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ error: "Failed to load filters" });
  }
};

// ================= SEARCH =================
exports.searchColleges = async (req, res) => {
  try {
    const { district, program, degree, branch } = req.body;

    const query = {};
    if (district) query.district = district;
    if (program) query.program = program;
    if (degree) query.degree = degree;
    if (branch) query.branch = branch;

    const colleges = await College.find(query);

    if (!colleges.length) {
      return res.json({ type: "no_results", colleges: [] });
    }

    colleges.sort((a, b) =>
      (b.ranking?.suitability || 0) -
      (a.ranking?.suitability || 0)
    );

    res.json({
      type: "valid",
      colleges: colleges.map(c => ({
        _id: c._id,
        name: c.name,
        location: c.location,
        facts: c.facts,
        avgPackage: c.ranking?.avgPackage,
        matchScore: c.ranking?.suitability || 0
      }))
    });

  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};
