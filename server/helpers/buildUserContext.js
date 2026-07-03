import User      from '../models/User.model.js';
import Resume    from '../models/Resume.model.js';
import Interview from '../models/Interview.model.js';
import Dsa       from '../models/Dsa.model.js';
import Job       from '../models/Job.model.js';

// ─── Education domain / level inference ──────────────────────────────────────

function deriveEducation(degree = '', branch = '') {
  const text = `${degree} ${branch}`.toLowerCase();

  let level = degree || 'Graduate';
  if      (text.match(/b\.?tech|b\.?e\b|bachelor.*eng/))     level = 'B.Tech/BE';
  else if (text.match(/\bbca\b/))                             level = 'BCA';
  else if (text.match(/\bmca\b/))                             level = 'MCA';
  else if (text.match(/\bmba\b/))                             level = 'MBA';
  else if (text.match(/m\.?tech|m\.?e\b|master.*eng/))       level = 'M.Tech/ME';
  else if (text.match(/b\.?sc|bachelor.*science/))            level = 'BSc';
  else if (text.match(/m\.?sc|master.*science/))              level = 'MSc';
  else if (text.match(/diploma/))                             level = 'Diploma';

  let domain = 'General';
  if      (text.match(/computer|cse|\bcs\b|\bc\.s\b|information tech|software|\bit\b|\bbca\b|\bmca\b/)) domain = 'CS/IT';
  else if (text.match(/mechan|automobile/))                   domain = 'Mechanical';
  else if (text.match(/civil|struct/))                        domain = 'Civil';
  else if (text.match(/electrical|eee|ece|electronics|e&c/)) domain = 'ECE/EEE';
  else if (text.match(/mba|management|business|commerce/))    domain = 'MBA/Management';
  else if (text.match(/chemical|chem/))                       domain = 'Chemical';
  else if (text.match(/data science|analytics|\bai\b|machine learn/)) domain = 'Data Science/AI';

  return { level, domain };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function buildUserContext(userId) {
  const [user, resume, interviews, dsaProblems, jobs] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Resume.findOne({ user: userId }).lean(),
    Interview.find({ user: userId }).lean(),
    Dsa.find({ user: userId }).lean(),
    Job.find({ user: userId }).lean(),
  ]);

  // DSA stats
  const easy   = dsaProblems.filter(p => p.difficulty === 'Easy');
  const medium = dsaProblems.filter(p => p.difficulty === 'Medium');
  const hard   = dsaProblems.filter(p => p.difficulty === 'Hard');
  const dsaStats = {
    total:        dsaProblems.length,
    solved:       dsaProblems.filter(p => p.status === 'Solved').length,
    easy:         easy.length,   easySolved:   easy.filter(p => p.status === 'Solved').length,
    medium:       medium.length, mediumSolved: medium.filter(p => p.status === 'Solved').length,
    hard:         hard.length,   hardSolved:   hard.filter(p => p.status === 'Solved').length,
  };

  // Interview stats
  const completed = interviews.filter(i => i.status === 'Completed');
  const scores    = completed.map(i => i.score || 0);
  const interviewStats = {
    total:     interviews.length,
    completed: completed.length,
    avgScore:  scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    highScore: scores.length ? Math.max(...scores) : 0,
    topics:    interviews.slice(-5).map(i => i.topic).filter(Boolean),
  };

  // Job stats
  const jobStatusCounts = {};
  jobs.forEach(j => { jobStatusCounts[j.status] = (jobStatusCounts[j.status] || 0) + 1; });
  const recentCompanies = [...new Set(jobs.slice(-10).map(j => j.company).filter(Boolean))].slice(0, 5);
  const jobStats = { total: jobs.length, byStatus: jobStatusCounts, recentCompanies };

  // Identity — User model is primary source; resume personal is fallback
  const p = resume?.personal || {};
  const name           = user?.name           || p.fullName       || '';
  const email          = user?.email          || p.email          || '';
  const degree         = user?.degree         || p.degree         || '';
  const branch         = user?.branch         || '';
  const college        = user?.college        || p.college        || '';
  const graduationYear = user?.graduationYear || p.graduationYear || '';
  const dreamRole      = user?.dreamRole      || '';
  const currentStatus  = user?.currentStatus  || '';
  const bio            = user?.bio            || p.summary        || '';

  const { level: educationLevel, domain: educationDomain } = deriveEducation(degree, branch);

  // Skills — merge User skills + Resume skills, deduplicate
  const skills = [...new Set([...(user?.skills || []), ...(resume?.skills || [])])];

  return {
    name, email,
    degree, branch, college, graduationYear,
    educationLevel, educationDomain,
    dreamRole, currentStatus, bio,
    skills,
    resume,
    dsaStats, interviewStats, jobStats,
  };
}
