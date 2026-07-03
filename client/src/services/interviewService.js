import api from './api';

export async function getInterviews() {
  const { data } = await api.get('/interview');
  return data.interviews;
}

export async function createInterview(payload) {
  const { data } = await api.post('/interview', payload);
  return data.interview;
}

export async function updateInterview(id, payload) {
  const { data } = await api.put(`/interview/${id}`, payload);
  return data.interview;
}

export async function deleteInterview(id) {
  await api.delete(`/interview/${id}`);
}

export async function evaluateAnswers(questions) {
  const { data } = await api.post('/interview/evaluate', { questions });
  return data.evaluations;
}
