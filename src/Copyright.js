import { Typography, Link } from "@mui/material";

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      sx={{
        my: 1,
        position: "absolute",
        bottom: 0,
        width: "100%",
        color: "white",
      }}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://github.com/Skulldorom"
        sx={{ color: "white" }}
      >
        Skulldorom
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
