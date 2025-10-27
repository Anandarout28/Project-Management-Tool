import React from "react";
import { Chip } from "@mui/material";

const colorMap = {
  "pending": "default",
  "in-progress": "info",
  "completed": "success",
  "blocked": "warning"
};

export default function StatusChip({ status }) {
  return <Chip label={status.replace(/-/g, " ")} color={colorMap[status] || "default"} size="small" />;
}
