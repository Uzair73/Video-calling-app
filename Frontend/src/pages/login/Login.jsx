import React, { useState } from "react";
import { Box, Container, Typography, TextField } from "@mui/material";
import Button from "../../components/button/button"; // Assuming you have a custom Button component
import {Link} from 'react-router-dom'

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handle_change = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    console.log("submitted the data", input);
  };

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "#1E1E2F", // Dark background
          color: "#FFFFFF", // Text color
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          marginTop: "3rem", // Center the login form vertically
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
            Login
          </Typography>
          <Box component="form" onSubmit={handle_submit} noValidate sx={{ mt: 1, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={input.email}
              onChange={handle_change}
              InputLabelProps={{ style: { color: "#FFFFFF" } }}
              InputProps={{
                style: { color: "#FFFFFF", backgroundColor: "#292942", borderRadius: "5px" },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={input.password}
              onChange={handle_change}
              InputLabelProps={{ style: { color: "#FFFFFF" } }}
              InputProps={{
                style: { color: "#FFFFFF", backgroundColor: "#292942", borderRadius: "5px" },
              }}
            />
            <Button
              buttonText={"Login"}
              btn_variant={"contained"}
              class_name={{
                m: 2,
                mt: 3,
                pl: 5,
                pr: 5,
                mb: 2,
              }}
              sx={{
                backgroundColor: "#0078FF",
                color: "#FFFFFF",
                "&:hover": { backgroundColor: "#0056B3" },
                padding: "0.8rem 2.5rem",
                borderRadius: "5px",
              }}
            />
           <div style={{ marginTop: "1rem", textAlign: "center", color: "#FFFFFF" }}>
              Don't have an account? <Link to='/register' style={{ color: "#0078FF" }}>Register Yourself</Link>
           </div>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
