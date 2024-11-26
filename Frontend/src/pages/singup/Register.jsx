import { Box, Container, Typography, TextField, Alert } from "@mui/material";
import React, { useState } from "react";
import Button from "../../components/button/button";
import {Link} from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Reset error message on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    console.log(formData);
    // Proceed with form submission logic here
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "#1E1E2F", // Dark background
        color: "#FFFFFF", // Text color
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        marginTop: "3rem", // Center the register form vertically
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ width: "100%", marginBottom: "1rem" }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#FFFFFF" } }}
            InputProps={{
              style: { color: "#FFFFFF", backgroundColor: "#292942", borderRadius: "5px" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
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
            value={formData.password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#FFFFFF" } }}
            InputProps={{
              style: { color: "#FFFFFF", backgroundColor: "#292942", borderRadius: "5px" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Confirm Password"
            type="password"
            id="confirm_password"
            autoComplete="current-password"
            value={formData.confirm_password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#FFFFFF" } }}
            InputProps={{
              style: { color: "#FFFFFF", backgroundColor: "#292942", borderRadius: "5px" },
            }}
          />
          <Button
            buttonText={"Register Now"}
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
            Already have an account?
           <Link to='/'>Login</Link>
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
