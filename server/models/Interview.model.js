import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question:    { type: String, default: '' },
    answer:      { type: String, default: '' },
    idealAnswer: { type: String, default: '' },
    score:       { type: Number, default: 0 },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role:       { type: String, trim: true, default: '' },
    company:    { type: String, trim: true, default: '' },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed'],
      default: 'Scheduled',
    },
    score:       { type: Number, default: 0 },
    feedback:    { type: String, default: '' },
    questions:   { type: [questionSchema], default: [] },
    startedAt:   { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
