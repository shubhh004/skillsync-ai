import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role:      { type: String, enum: ['user', 'assistant'], required: true },
    content:   { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const careerChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title:    { type: String, trim: true, default: 'New Conversation' },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

const CareerChat = mongoose.model('CareerChat', careerChatSchema);

export default CareerChat;
