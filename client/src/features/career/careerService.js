import api from '../../services/api';

export async function sendMessage(message, chatId = null) {
  const { data } = await api.post('/career/chat', { message, chatId });
  return data; // { reply, chatId }
}

export async function getChats() {
  const { data } = await api.get('/career/chats');
  return data.chats;
}

export async function getChat(id) {
  const { data } = await api.get(`/career/chat/${id}`);
  return data.chat;
}

export async function deleteChat(id) {
  await api.delete(`/career/chat/${id}`);
}
