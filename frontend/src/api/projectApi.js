import axios from "axios";
const API_URL = "http://localhost:8000";

export async function getProjects(token) {
  return axios.get(`${API_URL}/projects/`, { headers: { Authorization: `Bearer ${token}` } });
}
export async function createProject(data, token) {
  return axios.post(`${API_URL}/projects/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateProject(id, data, token) {
  return axios.put(`${API_URL}/projects/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
}
export async function deleteProject(id, token) {
  return axios.delete(`${API_URL}/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}
