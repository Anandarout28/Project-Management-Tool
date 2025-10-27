import React from "react";
import { Card, CardContent, Typography, Chip, LinearProgress, CardActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{project.name}</Typography>
        <Typography variant="body2" color="text.secondary">{project.description}</Typography>
        <LinearProgress variant="determinate" value={project.progress || 0} sx={{ mt: 2, mb: 1 }} />
        <Chip label={`Owner: ${project.owner_id}`} size="small" />
      </CardContent>
      <CardActions>
        <Button onClick={() => navigate(`/projects/${project.id}`)}>View Details</Button>
      </CardActions>
    </Card>
  );
}
