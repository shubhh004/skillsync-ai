import Interview from '../models/Interview.model.js';
import { evaluateInterviewAnswers } from '../services/gemini.service.js';

const FIELDS = [
  'role', 'company', 'difficulty', 'status',
  'score', 'feedback', 'questions', 'startedAt', 'completedAt',
];

export async function createInterview(req, res, next) {
  try {
    const interview = await Interview.create({
      user: req.userId,
      ...pick(req.body, FIELDS),
    });
    res.status(201).json({ interview });
  } catch (err) {
    next(err);
  }
}

export async function getInterviews(req, res, next) {
  try {
    const interviews = await Interview.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ interviews });
  } catch (err) {
    next(err);
  }
}

export async function getInterview(req, res, next) {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.userId });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json({ interview });
  } catch (err) {
    next(err);
  }
}

export async function updateInterview(req, res, next) {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.userId });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const updated = await Interview.findByIdAndUpdate(
      req.params.id,
      { $set: pick(req.body, FIELDS) },
      { new: true, runValidators: true }
    );

    res.json({ interview: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteInterview(req, res, next) {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.userId });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    await interview.deleteOne();
    res.json({ message: 'Interview deleted' });
  } catch (err) {
    next(err);
  }
}

export async function evaluateAnswers(req, res, next) {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'questions array is required' });
    }
    const evaluations = await evaluateInterviewAnswers(questions);
    res.json({ evaluations });
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
