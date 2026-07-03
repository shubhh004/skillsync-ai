import CareerChat from '../models/CareerChat.model.js';
import { buildUserContext } from '../helpers/buildUserContext.js';
import { chatWithCareerCoach } from '../services/groq.service.js';

function generateTitle(message) {
  const trimmed = message.trim().replace(/[^\w\s]/g, '').trim();
  const words   = trimmed.split(/\s+/).slice(0, 6).join(' ');
  return words.length > 2 ? words : 'Career Conversation';
}

export async function sendMessage(req, res, next) {
  try {
    const { message, chatId } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'message is required' });

    const userId = req.userId;

    let chat;
    if (chatId) {
      chat = await CareerChat.findOne({ _id: chatId, user: userId });
      if (!chat) return res.status(404).json({ error: 'Chat not found' });
    } else {
      chat = await CareerChat.create({ user: userId, title: generateTitle(message), messages: [] });
    }

    const userContext = await buildUserContext(userId);
    const reply = await chatWithCareerCoach(userContext, chat.messages, message.trim());

    chat.messages.push({ role: 'user',      content: message.trim() });
    chat.messages.push({ role: 'assistant', content: reply });
    await chat.save();

    res.json({ reply, chatId: chat._id });
  } catch (err) {
    next(err);
  }
}

export async function getChats(req, res, next) {
  try {
    const chats = await CareerChat.find({ user: req.userId })
      .select('title updatedAt messages')
      .sort({ updatedAt: -1 })
      .lean();

    const list = chats.map((c) => ({
      _id:       c._id,
      title:     c.title,
      updatedAt: c.updatedAt,
      preview:   c.messages.at(-1)?.content?.slice(0, 80) ?? '',
      count:     c.messages.length,
    }));

    res.json({ chats: list });
  } catch (err) {
    next(err);
  }
}

export async function getChat(req, res, next) {
  try {
    const chat = await CareerChat.findOne({ _id: req.params.id, user: req.userId }).lean();
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json({ chat });
  } catch (err) {
    next(err);
  }
}

export async function deleteChat(req, res, next) {
  try {
    const chat = await CareerChat.findOne({ _id: req.params.id, user: req.userId });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    await chat.deleteOne();
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    next(err);
  }
}
