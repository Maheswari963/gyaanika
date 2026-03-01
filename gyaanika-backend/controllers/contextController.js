const College = require('../models/College');
const Review = require('../models/Review');

exports.getContext = async (req, res) => {
    const startTime = Date.now();

    try {
        // Parallel data fetching for maximum performance
        const [districts, programs, degrees, branches, totalColleges, featuredColleges] = await Promise.all([
            College.distinct('district'),
            College.distinct('program'),
            College.distinct('degree'),
            College.distinct('branch'),
            College.countDocuments(),
            College.find().sort({ 'ranking.suitability': -1 }).limit(3).select('name location ranking images')
        ]);

        // Construct the "One-Call" payload
        const payload = {
            meta: {
                appName: "Gyaanika",
                version: "2.0.0-Pro",
                timestamp: new Date().toISOString(),
                serverLatency: `${Date.now() - startTime}ms`
            },
            filters: {
                districts: districts.filter(Boolean).sort(),
                programs: programs.filter(Boolean).sort(),
                degrees: degrees.filter(Boolean).sort(),
                branches: branches.filter(Boolean).sort()
            },
            stats: {
                totalInstitutions: totalColleges,
                placementsTracked: "98%",
                studentsGuided: 12450
            },
            featured: featuredColleges
        };

        res.json({
            status: "success",
            data: payload
        });

    } catch (err) {
        console.error("Context Error:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to initialize application context"
        });
    }
};
