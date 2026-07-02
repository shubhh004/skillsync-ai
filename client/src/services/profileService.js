import api from './api';

export async function getProfile() {
  const { data } = await api.get('/profile');
  return data.user;
}

export async function updateProfile(updates) {
  const { data } = await api.put('/profile', updates);
  return data.user;
}
