import React, { useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";
import { useProjects } from "../../hooks/useProjects";

export default function ProjectList() {
  const { projects, fetchProjects, openForm, setOpenForm } = useProjects();

  useEffect(() => { fetchProjects(); }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {projects.map(proj => (
          <Grid item xs={12} sm={6} md={4} key={proj.id}>
            <ProjectCard project={proj} />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" onClick={() => setOpenForm(true)} sx={{ mt: 3 }}>Add Project</Button>
      {openForm && <ProjectForm open={openForm} handleClose={() => setOpenForm(false)} />}
    </Box>
  );
}
