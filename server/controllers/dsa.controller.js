import Dsa from '../models/Dsa.model.js';

export async function createProblem(req, res, next) {
  try {
    const { title, topic, difficulty, status, platform, problemUrl, notes } = req.body;

    if (!title || !topic) {
      return res.status(400).json({ error: 'title and topic are required' });
    }

    const problem = await Dsa.create({
      user: req.userId,
      title, topic, difficulty, status, platform, problemUrl, notes,
    });

    res.status(201).json({ problem });
  } catch (err) {
    next(err);
  }
}

export async function getProblems(req, res, next) {
  try {
    const problems = await Dsa.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ problems });
  } catch (err) {
    next(err);
  }
}

export async function getProblem(req, res, next) {
  try {
    const problem = await Dsa.findOne({ _id: req.params.id, user: req.userId });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json({ problem });
  } catch (err) {
    next(err);
  }
}

export async function updateProblem(req, res, next) {
  try {
    const problem = await Dsa.findOne({ _id: req.params.id, user: req.userId });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const { title, topic, difficulty, status, platform, problemUrl, notes } = req.body;
    const updates = { title, topic, difficulty, status, platform, problemUrl, notes };

    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    const updated = await Dsa.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ problem: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteProblem(req, res, next) {
  try {
    const problem = await Dsa.findOne({ _id: req.params.id, user: req.userId });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    await problem.deleteOne();
    res.json({ message: 'Problem deleted' });
  } catch (err) {
    next(err);
  }
}
