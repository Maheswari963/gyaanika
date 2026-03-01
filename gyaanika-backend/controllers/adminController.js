const Review = require('../models/Review');
const College = require('../models/College'); // Needed for fixing data
const { signToken } = require('../middleware/authMiddleware');

// LOGIN
exports.login = (req, res) => {
    const { user, pass } = req.body;

    // Check credentials against ENV
    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
        // Generate Token
        const token = signToken({ user, role: 'admin' });

        return res.json({
            status: 'success',
            token: token,
            message: "Welcome back, Administrator."
        });
    }

    res.status(401).json({ status: 'error', message: "Invalid Credentials" });
};

// GET REVIEWS (Protected)
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json({ status: "success", data: reviews });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Failed to fetch reviews" });
    }
};

// RESOLVE/DELETE REVIEW
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ status: "success", message: "Ticket resolved" });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Failed to delete review" });
    }
};

// FIX DATA & RESOLVE
exports.fixIssue = async (req, res) => {
    const { ticketId, collegeId, corrections } = req.body;

    try {
        // 1. Apply corrections to the College DB
        if (collegeId && corrections) {
            await College.findByIdAndUpdate(collegeId, { $set: corrections });
        }

        // 2. Delete the ticket
        await Review.findByIdAndDelete(ticketId);

        res.json({ status: "success", message: "Data corrected and ticket resolved." });

    } catch (err) {
        console.error("Fix Error:", err);
        res.status(500).json({ status: "error", message: "Failed to apply fix." });
    }
};
