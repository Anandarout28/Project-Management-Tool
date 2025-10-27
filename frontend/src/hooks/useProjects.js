import { useState } from "react";
import { getProjects, createProject } from "../api/projectApi";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getProjects(token);
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const fetchProject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await getProjects(token);
      const proj = res.data.find(p => p.id === parseInt(id));
      setProject(proj);
    } catch (error) {
      console.error("Failed to fetch project", error);
    }
  };

  return { projects, project, fetchProjects, fetchProject, openForm, setOpenForm };
}
