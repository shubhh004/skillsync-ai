import User from '../models/User.model.js';

const ALLOWED_FIELDS = [
  'name', 'avatar',
  'phone', 'city', 'state',
  'college', 'university', 'degree', 'branch', 'graduationYear',
  'currentStatus', 'dreamRole',
  'github', 'linkedin', 'portfolio', 'leetcode', 'codeforces', 'hackerrank',
  'bio', 'skills',
];

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updates = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
