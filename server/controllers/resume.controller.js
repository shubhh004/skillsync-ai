import Resume from '../models/Resume.model.js';

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
