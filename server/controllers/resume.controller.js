import Resume from '../models/Resume.model.js';

export async function getAtsScore(req, res, next) {
  try {
    let resume = await Resume.findOne({ user: req.userId });
    if (!resume) resume = await Resume.create({ user: req.userId });

    const { personal, skills, education, experience, projects, certifications, achievements } = resume;

    // Contact (max 20)
    let contactScore = 0;
    const contactSuggestions = [];
    if (personal.fullName) contactScore += 4; else contactSuggestions.push('Add your full name to the contact section.');
    if (personal.email)    contactScore += 4; else contactSuggestions.push('Add your email address.');
    if (personal.phone)    contactScore += 3; else contactSuggestions.push('Add your phone number.');
    if (personal.location) contactScore += 3; else contactSuggestions.push('Add your location (city, state).');
    if (personal.linkedin) contactScore += 3; else contactSuggestions.push('Add your LinkedIn profile URL.');
    if (personal.github)   contactScore += 3; else contactSuggestions.push('Add your GitHub profile URL.');

    // Education (max 15)
    let educationScore = 0;
    const educationSuggestions = [];
    if (education.length > 0) {
      educationScore += 8;
      const edu = education[0];
      if (edu.college || edu.institution || edu.school) educationScore += 3;
      else educationSuggestions.push('Add your college/university name to your education entry.');
      if (edu.degree || edu.field || edu.course) educationScore += 2;
      else educationSuggestions.push('Specify your degree or field of study.');
      if (edu.graduationYear || edu.year || edu.endDate) educationScore += 2;
      else educationSuggestions.push('Add your graduation year to education.');
    } else {
      educationSuggestions.push('Add your education details (college, degree, graduation year).');
    }

    // Skills (max 20)
    let skillsScore = 0;
    const skillsSuggestions = [];
    if (skills.length >= 1)  skillsScore += 5;
    if (skills.length >= 5)  skillsScore += 5;
    if (skills.length >= 10) skillsScore += 5;
    if (skills.length >= 15) skillsScore += 5;
    if (skills.length < 5)        skillsSuggestions.push('Add at least 5 skills relevant to your target role.');
    else if (skills.length < 10)  skillsSuggestions.push('Aim for 10+ skills to improve ATS keyword matching.');
    else if (skills.length < 15)  skillsSuggestions.push('Adding 15+ skills can further improve keyword coverage.');

    // Experience (max 20)
    let experienceScore = 0;
    const experienceSuggestions = [];
    if (experience.length >= 1) experienceScore += 12;
    if (experience.length >= 2) experienceScore += 5;
    if (experience.length >= 3) experienceScore += 3;
    if (experience.length === 0) experienceSuggestions.push('Add internships, part-time jobs, or freelance experience.');
    else if (experience.length < 2) experienceSuggestions.push('Adding more experience entries strengthens your profile.');

    // Projects (max 15)
    let projectsScore = 0;
    const projectsSuggestions = [];
    if (projects.length >= 1) projectsScore += 8;
    if (projects.length >= 2) projectsScore += 4;
    if (projects.length >= 3) projectsScore += 3;
    if (projects.length === 0) projectsSuggestions.push('Add at least 2–3 personal or academic projects.');
    else if (projects.length < 2) projectsSuggestions.push('Add at least one more project to showcase your work.');

    // Certifications (max 5)
    const certificationsScore = certifications.length > 0 ? 5 : 0;
    const certificationsSuggestions = certifications.length === 0
      ? ['Add relevant certifications (e.g., AWS, Google, Coursera) to boost credibility.']
      : [];

    // Achievements (max 5)
    const achievementsScore = achievements.length > 0 ? 5 : 0;
    const achievementsSuggestions = achievements.length === 0
      ? ['List academic or competitive achievements (hackathons, scholarships, ranks).']
      : [];

    const breakdown = {
      contact:        { score: contactScore,        max: 20 },
      education:      { score: educationScore,      max: 15 },
      skills:         { score: skillsScore,         max: 20 },
      experience:     { score: experienceScore,     max: 20 },
      projects:       { score: projectsScore,       max: 15 },
      certifications: { score: certificationsScore, max: 5  },
      achievements:   { score: achievementsScore,   max: 5  },
    };

    const score = Object.values(breakdown).reduce((sum, s) => sum + s.score, 0);

    const missingSections = Object.entries(breakdown)
      .filter(([, s]) => s.score === 0)
      .map(([key]) => key);

    const suggestions = [
      ...contactSuggestions,
      ...educationSuggestions,
      ...skillsSuggestions,
      ...experienceSuggestions,
      ...projectsSuggestions,
      ...certificationsSuggestions,
      ...achievementsSuggestions,
    ];

    res.json({ score, breakdown, missingSections, suggestions });
  } catch (err) {
    next(err);
  }
}

const PERSONAL_FIELDS = [
  'fullName', 'email', 'phone', 'college', 'degree',
  'graduationYear', 'location', 'linkedin', 'github', 'portfolio', 'summary',
];

const ARRAY_FIELDS = [
  'skills', 'education', 'experience', 'projects', 'certifications', 'achievements',
];

export async function getResume(req, res, next) {
  try {
    let resume = await Resume.findOne({ user: req.userId });

    if (!resume) {
      resume = await Resume.create({ user: req.userId });
    }

    res.json({ resume });
  } catch (err) {
    next(err);
  }
}

export async function updateResume(req, res, next) {
  try {
    const updates = {};

    if (req.body.personal && typeof req.body.personal === 'object') {
      for (const field of PERSONAL_FIELDS) {
        if (req.body.personal[field] !== undefined) {
          updates[`personal.${field}`] = req.body.personal[field];
        }
      }
    }

    for (const field of ARRAY_FIELDS) {
      if (Array.isArray(req.body[field])) {
        updates[field] = req.body[field];
      }
    }

    const resume = await Resume.findOneAndUpdate(
      { user: req.userId },
      { $set: updates },
      { new: true, runValidators: true, upsert: true }
    );

    res.json({ resume });
  } catch (err) {
    next(err);
  }
}
