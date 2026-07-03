import Roadmap from '../models/Roadmap.model.js';
import { buildUserContext } from '../helpers/buildUserContext.js';
import { generateRoadmap } from '../services/groq.service.js';

function parseReadinessScore(content) {
  const m = content.match(/readiness\s+score[:\s]+(\d+)/i);
  return m ? Math.min(100, Math.max(0, parseInt(m[1], 10))) : 0;
}

function parseChecklist(content) {
  const lines = content.match(/^- \[ \] .+$/gm) || [];
  return lines.map(line => ({ text: line.replace(/^- \[ \] /, '').trim(), done: false }));
}

function validateForm(body) {
  const { targetRole, timeline, skillLevel } = body;
  if (!targetRole?.trim()) return 'targetRole is required';
  if (!timeline?.trim())   return 'timeline is required';
  const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
  if (skillLevel && !validLevels.includes(skillLevel)) return 'Invalid skillLevel';
  return null;
}

export async function createRoadmap(req, res, next) {
  try {
    const err = validateForm(req.body);
    if (err) return res.status(400).json({ error: err });

    const { targetCompany = '', targetRole, timeline, skillLevel = 'Intermediate' } = req.body;
    const userContext = await buildUserContext(req.userId);
    const content     = await generateRoadmap(userContext, {
      targetCompany: targetCompany.trim(),
      targetRole:    targetRole.trim(),
      timeline:      timeline.trim(),
      skillLevel,
    });

    const roadmap = await Roadmap.create({
      user:           req.userId,
      targetCompany:  targetCompany.trim(),
      targetRole:     targetRole.trim(),
      timeline:       timeline.trim(),
      skillLevel,
      content,
      checklist:      parseChecklist(content),
      readinessScore: parseReadinessScore(content),
    });

    res.status(201).json({ roadmap });
  } catch (err) {
    next(err);
  }
}

export async function getRoadmaps(req, res, next) {
  try {
    const roadmaps = await Roadmap.find({ user: req.userId })
      .select('targetCompany targetRole timeline skillLevel readinessScore checklist updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .lean();

    const list = roadmaps.map(r => ({
      ...r,
      checklistTotal: r.checklist.length,
      checklistDone:  r.checklist.filter(i => i.done).length,
      checklist:      undefined,
    }));

    res.json({ roadmaps: list });
  } catch (err) {
    next(err);
  }
}

export async function getRoadmap(req, res, next) {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.userId }).lean();
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    res.json({ roadmap });
  } catch (err) {
    next(err);
  }
}

export async function updateChecklist(req, res, next) {
  try {
    const { checklist } = req.body;
    if (!Array.isArray(checklist)) return res.status(400).json({ error: 'checklist array is required' });

    const roadmap = await Roadmap.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { checklist } },
      { new: true }
    ).lean();

    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    res.json({ roadmap });
  } catch (err) {
    next(err);
  }
}

export async function deleteRoadmap(req, res, next) {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.userId });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    await roadmap.deleteOne();
    res.json({ message: 'Roadmap deleted' });
  } catch (err) {
    next(err);
  }
}

export async function regenerateRoadmap(req, res, next) {
  try {
    const existing = await Roadmap.findOne({ _id: req.params.id, user: req.userId });
    if (!existing) return res.status(404).json({ error: 'Roadmap not found' });

    const userContext = await buildUserContext(req.userId);
    const content     = await generateRoadmap(userContext, {
      targetCompany: existing.targetCompany,
      targetRole:    existing.targetRole,
      timeline:      existing.timeline,
      skillLevel:    existing.skillLevel,
    });

    existing.content        = content;
    existing.checklist      = parseChecklist(content);
    existing.readinessScore = parseReadinessScore(content);
    await existing.save();

    res.json({ roadmap: existing });
  } catch (err) {
    next(err);
  }
}

export async function getLatestRoadmap(req, res, next) {
  try {
    const roadmap = await Roadmap.findOne({ user: req.userId })
      .select('targetCompany targetRole timeline readinessScore checklist updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    if (!roadmap) return res.json({ roadmap: null });

    res.json({
      roadmap: {
        ...roadmap,
        checklistTotal: roadmap.checklist.length,
        checklistDone:  roadmap.checklist.filter(i => i.done).length,
        checklist:      undefined,
      }
    });
  } catch (err) {
    next(err);
  }
}
