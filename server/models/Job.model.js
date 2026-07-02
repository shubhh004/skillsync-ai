import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'OA', 'Interview', 'HR', 'Offer', 'Rejected', 'Accepted'],
      default: 'Applied',
    },
    location: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Internship', 'Full Time', 'Part Time'],
    },
    salary: {
      type: String,
      trim: true,
    },
    applicationLink: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
