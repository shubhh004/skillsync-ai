import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  targetCompany: { type: String, trim: true, default: '' },
  targetRole:    { type: String, trim: true, required: true },
  timeline:      { type: String, trim: true, default: '3 months' },
  skillLevel:    { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  content:       { type: String, required: true },  // full AI markdown
  checklist:     { type: [checklistItemSchema], default: [] },
  readinessScore:{ type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Roadmap', roadmapSchema);
