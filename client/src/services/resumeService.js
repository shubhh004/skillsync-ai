import api from './api';

export async function getResume() {
  const { data } = await api.get('/resume');
  return data.resume;
}

export async function updateResume(payload) {
  const { data } = await api.put('/resume', payload);
  return data.resume;
}

export async function getAtsScore() {
  const { data } = await api.get('/resume/ats');
  return data;
}

export async function matchJD(jobDescription) {
  const { data } = await api.post('/resume/ats/match', { jobDescription });
  return data;
}
