import { Box, Container, Typography, TextField, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import Button from "../../components/button/button";
import { Link } from 'react-router-dom';
import { register } from '../../api/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    user_password: "",
    confirm_user_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordHide, setPasswordHide] = useState(false);
  const [confrim_passwordHide, confirm_setPasswordHide] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const togglePassword = () => {
    setPasswordHide(!passwordHide);
  };

  const toggle_confrim_Password = () => {
    confirm_setPasswordHide(!confrim_passwordHide);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.username === "" || formData.email === "" || formData.user_password === "" || formData.confirm_user_password === ""){
      return setError("Please fill in all fields");
    }
    if (formData.user_password !== formData.confirm_user_password) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await register(formData);
      console.log("Registration successful", res.data);
      setSuccess(res.data.message);
      setError("");
    } catch (error) {
      console.error("Registration error", error);
      setError(error.response?.data?.message || "An unexpected error occurred.");
      setSuccess("");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "#1E1E2F",
        color: "#FFFFFF",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        marginTop: "3rem",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
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
            name="user_password"
            label="Password"
            type={passwordHide ? "text": "password"}
            id="user_password"
            autoComplete="current-password"
            value={formData.user_password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#FFFFFF" } }}
            InputProps={{
              style: { color: "#FFFFFF", backgroundColor: "#292942", borderRadius: "5px" },
               endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePassword}
                      edge="end"
                      sx={{ color: 'white' }}
                    >
                      {passwordHide ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirm_user_password"
            label="Confirm Password"
            type={confrim_passwordHide ? "text": "password"}
            id="confirm_user_password"
            autoComplete="current-password"
            value={formData.confirm_user_password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#FFFFFF" } }}
            InputProps={{
              style: { color: "#FFFFFF", backgroundColor: "#292942", borderRadius: "5px" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggle_confrim_Password}
                    edge="end"
                    sx={{ color: 'white' }}
                  >
                    {confrim_passwordHide ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
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
            <Link style={{marginLeft: 4, color: "#C4C4C4", textDecoration: "none" }} to='/'>Login</Link>
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
