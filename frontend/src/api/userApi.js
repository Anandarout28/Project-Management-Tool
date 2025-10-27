import axios from "axios";

const API_URL = "http://localhost:8000";

export async function registerUser({ username, email, password, role }) {
  return axios.post(`${API_URL}/users/`, { username, email, password, role });
}
export async function loginUser({ email, password }) {
  return axios.post("http://localhost:8000/users/login", { email, password });
}

export async function fetchUsers(token) {
  return axios.get(`${API_URL}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
