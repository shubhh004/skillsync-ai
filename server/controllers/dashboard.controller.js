import User from '../models/User.model.js';
import Dsa from '../models/Dsa.model.js';
import Job from '../models/Job.model.js';
import Resume from '../models/Resume.model.js';
import Interview from '../models/Interview.model.js';

export async function getDashboard(req, res, next) {
  try {
    const userId = req.userId;

    const [user, dsaProblems, jobs, resume, interviews] = await Promise.all([
      User.findById(userId).select('-password').lean(),
      Dsa.find({ user: userId }).lean(),
      Job.find({ user: userId }).lean(),
      Resume.findOne({ user: userId }).lean(),
      Interview.find({ user: userId }).lean(),
    ]);

    // ── DSA stats ──────────────────────────────────────────────────────────────
    const easy   = dsaProblems.filter((p) => p.difficulty === 'Easy');
    const medium = dsaProblems.filter((p) => p.difficulty === 'Medium');
    const hard   = dsaProblems.filter((p) => p.difficulty === 'Hard');
    const dsaStats = {
      total:        dsaProblems.length,
      solved:       dsaProblems.filter((p) => p.status === 'Solved').length,
      attempted:    dsaProblems.filter((p) => p.status === 'Attempted').length,
      todo:         dsaProblems.filter((p) => p.status === 'Todo').length,
      easy:         easy.length,
      easySolved:   easy.filter((p) => p.status === 'Solved').length,
      medium:       medium.length,
      mediumSolved: medium.filter((p) => p.status === 'Solved').length,
      hard:         hard.length,
      hardSolved:   hard.filter((p) => p.status === 'Solved').length,
    };

    // ── Resume completion % (7 sections) ───────────────────────────────────────
    let resumeCompletion = 0;
    if (resume) {
      const p = resume.personal || {};
      const filled = [
        Object.values(p).some((v) => typeof v === 'string' && v.trim()),
        resume.skills?.length > 0,
        resume.education?.length > 0,
        resume.experience?.length > 0,
        resume.projects?.length > 0,
        resume.certifications?.length > 0,
        resume.achievements?.length > 0,
      ].filter(Boolean).length;
      resumeCompletion = Math.round((filled / 7) * 100);
    }

    // ── Job stats ──────────────────────────────────────────────────────────────
    const jobStatusCounts = {};
    jobs.forEach((j) => {
      jobStatusCounts[j.status] = (jobStatusCounts[j.status] || 0) + 1;
    });
    const jobStats = {
      total:    jobs.length,
      byStatus: jobStatusCounts,
    };

    // ── Interview stats ────────────────────────────────────────────────────────
    const completed = interviews.filter((i) => i.status === 'Completed');
    const scores    = completed.map((i) => i.score || 0);
    const interviewStats = {
      total:     interviews.length,
      completed: completed.length,
      scheduled: interviews.filter((i) => i.status === 'Scheduled').length,
      avgScore:  scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      highScore: scores.length ? Math.max(...scores) : 0,
    };

    // ── Weekly activity (last 7 days) ──────────────────────────────────────────
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekly = {
      dsaProblems:    dsaProblems.filter((p) => new Date(p.updatedAt) >= weekAgo).length,
      jobsApplied:    jobs.filter((j) => new Date(j.createdAt) >= weekAgo).length,
      interviewsDone: completed.filter((i) => i.completedAt && new Date(i.completedAt) >= weekAgo).length,
      resumeUpdated:  !!(resume && new Date(resume.updatedAt) >= weekAgo),
    };

    // ── Recent activity (last 8 items across all modules) ─────────────────────
    const allActivity = [];
    dsaProblems.forEach((p) => allActivity.push({
      type:      'dsa',
      title:     p.title,
      subtitle:  `${p.status} · ${p.difficulty} · ${p.topic}`,
      timestamp: p.updatedAt,
    }));
    jobs.forEach((j) => allActivity.push({
      type:      'job',
      title:     `${j.role} at ${j.company}`,
      subtitle:  j.status,
      timestamp: j.updatedAt,
    }));
    interviews.forEach((i) => allActivity.push({
      type:      'interview',
      title:     i.role || 'Mock Interview',
      subtitle:  `${i.status}${i.score ? ` · Score ${i.score}` : ''}`,
      timestamp: i.updatedAt,
    }));
    if (resume) allActivity.push({
      type:      'resume',
      title:     'Resume Updated',
      subtitle:  `${resumeCompletion}% complete`,
      timestamp: resume.updatedAt,
    });

    const recentActivity = allActivity
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);

    // ── Upcoming (scheduled interviews) ───────────────────────────────────────
    const upcoming = interviews
      .filter((i) => i.status === 'Scheduled')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, 5)
      .map(({ _id, role, company, difficulty, createdAt }) => ({ _id, role, company, difficulty, createdAt }));

    res.json({
      user,
      dsa:            dsaStats,
      resumeCompletion,
      jobs:           jobStats,
      interviews:     interviewStats,
      weekly,
      recentActivity,
      upcoming,
    });
  } catch (err) {
    next(err);
  }
}
