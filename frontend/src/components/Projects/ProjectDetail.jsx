import React, { useEffect } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useParams } from "react-router-dom";
import TaskList from "./TaskList";
import { useProjects } from "../../hooks/useProjects";

export default function ProjectDetail() {
  const { id } = useParams();
  const { project, fetchProject } = useProjects();

  useEffect(() => { fetchProject(id); }, [id]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">{project?.name}</Typography>
      <Typography sx={{ mb: 2 }}>{project?.description}</Typography>
      <Tabs value={0}>
        <Tab label="Tasks" />
      </Tabs>
      <TaskList projectId={id} />
    </Box>
  );
}
