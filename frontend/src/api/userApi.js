import axios from "axios";

const API_URL = "http://localhost:8000";

export async function registerUser({ username, email, password, role }) {
  return axios.post(`${API_URL}/users/`, { username, email, password, role });
}

export async function loginUser({ email, password }) {
  const form = new FormData();
  form.append("email", email);
  form.append("password", password);
  return axios.post(`${API_URL}/users/login`, form);
}

export async function fetchUsers(token) {
  return axios.get(`${API_URL}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
