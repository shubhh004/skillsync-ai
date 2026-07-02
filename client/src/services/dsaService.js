import api from './api';

export async function getProblems() {
  const { data } = await api.get('/dsa');
  return data.problems;
}

export async function createProblem(payload) {
  const { data } = await api.post('/dsa', payload);
  return data.problem;
}

export async function updateProblem(id, payload) {
  const { data } = await api.put(`/dsa/${id}`, payload);
  return data.problem;
}

export async function deleteProblem(id) {
  await api.delete(`/dsa/${id}`);
}
