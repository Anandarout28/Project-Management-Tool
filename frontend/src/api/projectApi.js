import axios from "axios";
const API_URL = "http://localhost:8000";

export async function fetchProjects(token) {
  return axios.get(`${API_URL}/projects/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createProject({ name, description, start_date, end_date }, token) {
  return axios.post(
    `${API_URL}/projects/`,
    { name, description, start_date, end_date },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
