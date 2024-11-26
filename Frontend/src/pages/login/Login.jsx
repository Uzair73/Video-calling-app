import React, { useState } from "react";
import { Box, Container, Typography, TextField, IconButton, InputAdornment, Alert } from "@mui/material";
import Button from "../../components/button/button"; // Assuming you have a custom Button component
import { Link } from 'react-router-dom';
import { login } from '../../api/api';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    user_password: "",
  });
  const [passwordHide, setPasswordHide] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handle_change = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");

  const togglePasswordVisibility = () => {
    setPasswordHide(!passwordHide);
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      const formdata = input
      const res = await login(formdata);
      console.log("Login successful", res.message);
      setSuccess(res.message);
      setError("");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      }
      setSuccess("");
    }
  };

  return (
    <>
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
            Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
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
              name="user_password"
              label="Password"
              type={passwordHide ? "password" : "text"}
              id="user_password"
              autoComplete="current-password"
              value={input.user_password}
              onChange={handle_change}
              InputLabelProps={{ style: { color: "#FFFFFF" } }}
              InputProps={{
                style: { color: "#FFFFFF", backgroundColor: "#292942", borderRadius: "5px" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'white' }}
                    >
                      {passwordHide ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
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
              Don't have an account? <Link to='/register' style={{ color: "#0078FF" }}> Register Yourself</Link>
            </div>
          </Box>
        </Box>
      </Container>
    </>
  )};
}
export default Login;
