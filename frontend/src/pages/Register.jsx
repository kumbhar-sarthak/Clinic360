import React, { useContext, useEffect, useState } from "react";
import { TextField, Grid, Button, MenuItem, Typography, Box, Paper } from "@mui/material";
import AuthContext from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, isRegister } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    specialty: "",
    experience: "",
    location: "",
    availability: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.role) {
      setError("Please select a role.");
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    if (isRegister) {
      navigate("/login", { replace: true });
    }
  }, [isRegister, navigate]);

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" p={2}>
      <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 700, bgcolor: "black", color: "white" }} className="mt-20 md:mt-0">
        <Typography variant="h4" align="center" className="float-left mb-2 mt-6">
          Start You Booking,
        </Typography>

        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="filled"
                label="Username"
                name="name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                InputProps={{ style: { backgroundColor: "#2c2c2c", color: "white" } }}
                InputLabelProps={{ style: { color: "#bbb" } }}
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                variant="filled"
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                InputProps={{ style: { backgroundColor: "#2c2c2c", color: "white" } }}
                InputLabelProps={{ style: { color: "#bbb" } }}
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                variant="filled"
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                InputProps={{ style: { backgroundColor: "#2c2c2c", color: "white" } }}
                InputLabelProps={{ style: { color: "#bbb" } }}
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                variant="filled"
                label="Role"
                name="role"
                fullWidth
                required
                value={formData.role}
                onChange={handleChange}
                InputProps={{ style: { backgroundColor: "#2c2c2c", color: "white" } }}
                InputLabelProps={{ style: { color: "#bbb" } }}
                autoComplete="off"
              >
                <MenuItem value="">Select a Role</MenuItem>
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </TextField>
            </Grid>

            {formData.role === "doctor" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="filled"
                    label="Specialization"
                    name="specialty"
                    fullWidth
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    InputProps={{ style: { backgroundColor: "#2c2c2c", color: "white" } }}
                    InputLabelProps={{ style: { color: "#bbb" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="filled"
                    label="Experience"
                    name="experience"
                    fullWidth
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    InputProps={{ style: { backgroundColor: "#2c2c2c", color: "white" } }}
                    InputLabelProps={{ style: { color: "#bbb" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="filled"
                    label="Location"
                    name="location"
                    fullWidth
                    required
                    value={formData.location}
                    onChange={handleChange}
                    InputProps={{ style: { backgroundColor: "#2c2c2c", color: "white" } }}
                    InputLabelProps={{ style: { color: "#bbb" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="filled"
                    label="Availability"
                    name="availability"
                    fullWidth
                    required
                    value={formData.availability}
                    onChange={handleChange}
                    InputProps={{ style: { backgroundColor: "#2c2c2c", color: "white" } }}
                    InputLabelProps={{ style: { color: "#bbb" } }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, py: 1.5, bgcolor: "#21848b", fontWeight: "bold" }}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
