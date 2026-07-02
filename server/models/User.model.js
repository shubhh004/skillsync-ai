import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:       { type: String, required: true },
    avatar:         { type: String },

    // Personal
    phone:          { type: String, trim: true },
    city:           { type: String, trim: true },
    state:          { type: String, trim: true },

    // Education
    college:        { type: String, trim: true },
    university:     { type: String, trim: true },
    degree:         { type: String, trim: true },
    branch:         { type: String, trim: true },
    graduationYear: { type: String, trim: true },

    // Career
    currentStatus:  { type: String, trim: true },
    dreamRole:      { type: String, trim: true },

    // Social
    github:         { type: String, trim: true },
    linkedin:       { type: String, trim: true },
    portfolio:      { type: String, trim: true },
    leetcode:       { type: String, trim: true },
    codeforces:     { type: String, trim: true },
    hackerrank:     { type: String, trim: true },

    // About
    bio:            { type: String, trim: true },
    skills:         { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
