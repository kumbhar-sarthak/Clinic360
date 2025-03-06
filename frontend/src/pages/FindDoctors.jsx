import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
} from "@mui/material";
const API_URL = import.meta.env.VITE_API_URL;


const FindDoctors = () => {
  

  const [filters, setFilters] = useState({
    location: "",
    speciality: "",
    experience: "",
    availability: "",
  });
  const [doctors, setDoctors] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_URL}/doctor/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
        credentials: "include",
      });

      const data = await response.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const sortedDoctors = [...doctors].sort((a, b) => {
    if (filters.location && a.location !== b.location) {
      return a.location === filters.location ? -1 : 1;
    }
    if (filters.speciality && a.specialty !== b.specialty) {
      return a.specialty === filters.speciality ? -1 : 1;
    }
    if (filters.experience) {
      return parseInt(b.experience) - parseInt(a.experience);
    }
    return 0;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          {[
            {
              name: "location",
              label: "Location",
              options: ["Gujarat", "Mumbai", "Goa", "Bengal"],
            },
            {
              name: "speciality",
              label: "Speciality",
              options: [
                "Heart Specialist",
                "Kidney Specialist",
                "Neuro Specialist",
                "MBBS Specialist",
                "General Physician",
                "General Practitioner",
                "General Surgery",
                "Orthopedic Surgery",
                "Plastic & Reconstructive Surgery",
                "Pediatric Surgery",
                "Vascular Surgery",
                "Neurosurgery",
                "Ophthalmology",
              ],
            },
            {
              name: "experience",
              label: "Experience",
              options: ["15 years", "10 years", "5 years", "2 years"],
            },
            {
              name: "availability",
              label: "Availability",
              options: [
                "10AM - 7PM",
                "12PM - 5PM",
                "1PM - 6PM",
                "11AM - 6PM",
                "2PM - 6PM",
                "10AM - 6PM",
              ],
            },
          ].map((field, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <TextField
                select
                fullWidth
                variant="filled"
                label={field.label}
                name={field.name}
                value={filters[field.name]}
                onChange={handleChange}
              >
                <MenuItem value="">Select {field.label}</MenuItem>
                {field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ px: 4 }}
          >
            Search
          </Button>
        </Grid>
      </Card>

      {sortedDoctors.length > 0 ? (
        <Grid container spacing={2}>
          {sortedDoctors.map((doctor) => {
            const isMatchingLocation =
              filters.location && doctor.location === filters.location;
            const isMatchingSpeciality =
              filters.speciality && doctor.specialty === filters.speciality;
            const isMatchingExperience =
              filters.experience && doctor.experience === filters.experience;

            return (
              <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Avatar
                    src={
                      doctor.avatar ||
                      "https://www.sonicseo.com/wp-content/uploads/2020/07/surgeon-768x768.jpg"
                    }
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <CardContent>
                    <Typography variant="h6">{doctor.name}</Typography>
                    <Typography variant="body2">ID: {doctor.userId}</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isMatchingSpeciality ? "bold" : "normal",
                      }}
                    >
                      Speciality: {doctor.specialty}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isMatchingExperience ? "bold" : "normal",
                      }}
                    >
                      Experience: {doctor.experience}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isMatchingLocation ? "bold" : "normal",
                      }}
                    >
                      Location: {doctor.location}
                    </Typography>
                    <Typography variant="body2">
                      Availability: {doctor.availability}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography align="center" color="textSecondary" sx={{ mt: 2 }}>
          No doctors found. Please search.
        </Typography>
      )}
    </Container>
  );
};

export default FindDoctors;
