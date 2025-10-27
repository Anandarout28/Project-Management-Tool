import axios from "axios";
const API_URL = "http://localhost:8000";

export async function fetchTasks(token) {
  return axios.get(`${API_URL}/tasks/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createTask(data, token) {
  return axios.post(`${API_URL}/tasks/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateTask(id, data, token) {
  return axios.put(`${API_URL}/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteTask(id, token) {
  return axios.delete(`${API_URL}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
