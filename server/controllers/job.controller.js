import Job from '../models/Job.model.js';

const FIELDS = ['company', 'role', 'status', 'location', 'jobType', 'salary', 'applicationLink', 'notes', 'appliedDate'];

export async function createJob(req, res, next) {
  try {
    const { company, role } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: 'company and role are required' });
    }

    const job = await Job.create({ user: req.userId, ...pick(req.body, FIELDS) });
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
}

export async function getJobs(req, res, next) {
  try {
    const jobs = await Job.find({ user: req.userId }).sort({ appliedDate: -1 });
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
}

export async function getJob(req, res, next) {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) {
    next(err);
  }
}

export async function updateJob(req, res, next) {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const updates = pick(req.body, FIELDS);

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ job: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req, res, next) {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
}

function pick(obj, keys) {
  return keys.reduce((acc, k) => {
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});
}
