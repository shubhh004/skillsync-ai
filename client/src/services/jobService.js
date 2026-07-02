import api from './api';

export async function getJobs() {
  const { data } = await api.get('/jobs');
  return data.jobs;
}

export async function createJob(payload) {
  const { data } = await api.post('/jobs', payload);
  return data.job;
}

export async function updateJob(id, payload) {
  const { data } = await api.put(`/jobs/${id}`, payload);
  return data.job;
}

export async function deleteJob(id) {
  await api.delete(`/jobs/${id}`);
}
