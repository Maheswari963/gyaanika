require('dotenv').config();
const mongoose = require('mongoose');
const College = require('./models/College');

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {

  const colleges = await College.find();

  for (const c of colleges) {

    c.profile = {
      overview: c.about || "",
      contact: {
        phone: c.phone || "",
        website: c.website || ""
      }
    };

    c.facts = {
      accreditation: c.accreditation || "",
      fees: c.fees || "",
      highestPackage: c.highestPackage || "",
      placementRate: c.placementRate || "",
      nirfRank: c.nirfRank || ""
    };

    if (Array.isArray(c.careerPaths)) {
  c.career = c.careerPaths.map((p) => {
    if (typeof p === "string") {
      return {
        role: p,
        sector: "General Technology"
      };
    }
    return p;
  });
} else {
  c.career = [];
}if (Array.isArray(c.infrastructure)) {
  c.infrastructure = c.infrastructure.map((item) => {
    if (typeof item === "string") {
      return { name: "Facility", detail: item };
    }
    return item;
  });
} else {
  c.infrastructure = [];
}


    if (Array.isArray(c.reviews)) {
  c.voices = c.reviews.map((r, i) => {
    if (typeof r === "string") {
      return {
        user: "Student",
        batch: "Recent",
        rating: 4,
        text: r
      };
    }
    return r;
  });
} else {
  c.voices = [];
}


    c.ranking = {
      avgPackage: c.avgPackage || "",
      suitability: c.suitability || 0,
      statusBadges: c.statusBadges || []
    };

    c.generated = !!c.about;

    await c.save();
    console.log("Migrated:", c.name);
  }

  console.log("✅ Migration finished");
  process.exit();

});

