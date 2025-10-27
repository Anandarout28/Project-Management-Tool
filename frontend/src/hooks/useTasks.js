import { useState } from "react";
import { fetchTasks } from "../api/taskApi";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const getTasks = async (projectId = null) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetchTasks(token);
      if (projectId) {
        setTasks(res.data.filter(t => t.project_id === projectId));
      } else {
        setTasks(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  return { tasks, fetchTasks: getTasks, openForm, setOpenForm };
}
