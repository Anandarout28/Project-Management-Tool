import React from "react";
import { Card, CardContent, Typography, Chip, CardActions, Button } from "@mui/material";
import StatusChip from "../StatusChip";

export default function TaskCard({ task }) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="text.secondary">{task.description}</Typography>
        <StatusChip status={task.status} />
        <Chip label={`Due: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}`} size="small" />
        {task.assignee_id && <Chip label={`Assigned: ${task.assignee_id}`} size="small" />}
      </CardContent>
      <CardActions>
        <Button size="small">Edit</Button>
      </CardActions>
    </Card>
  );
}
