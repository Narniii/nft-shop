import { Box } from "@mui/material";
import React from "react";

export default function TxtButton({
  text,
  width,
  height,
  bgColor,
  color,
  displayType,
  borderColor,
  onClick,
  margin,
  fontSize
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        background: bgColor,
        color: color,
        display: displayType ? displayType : "block",
        border: `2px solid ${borderColor}`,
        height: height,
        borderRadius: "4px",
        width: width ? width : "max-content",
        padding: "10px 20px",
        cursor: "pointer",
        margin: margin ? margin : "5px 1px",
        fontSize: fontSize ? fontSize : 'inherit'
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <span>{text}</span>
      </Box>
    </Box>
  );
}
