import { useContext, useState } from "react";
import { TextField, Button, MenuItem, Container, Card } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FaLocationCrosshairs } from "react-icons/fa6";
import AuthContext from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const FindDoctors = () => {
  const { getId, isLogin } = useContext(AuthContext);

  const navigate = useNavigate();

  if(!isLogin){
    return <Navigate to='/login' replace />;
  }
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

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        const city =
          data?.address?.city ||
          data?.address?.town ||
          data?.address?.village ||
          data?.address?.state;

        if (city) {
          setFilters((prev) => ({ ...prev, location: city }));
        } else {
          alert("Couldn't detect a specific location.");
        }
      } catch (error) {
        console.error("Error reverse geocoding:", error);
      }
    });
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

  const darktheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <div className="mt-16">
      <ThemeProvider theme={darktheme}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Card sx={{ p: 3, mb: 4 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                <div key={index} className="relative">
                  {field.name === "location" ? (
                    <div className="flex items-center space-x-4">
                      <div
                        className=" text-blue-300 cursor-pointer"
                        title="Detect my location"
                        onClick={handleDetectLocation}
                      >
                        <FaLocationCrosshairs size={20} />
                      </div>
                      <TextField
                        fullWidth
                        variant="filled"
                        label="Location"
                        name="location"
                        value={filters.location}
                        onChange={handleChange}
                        placeholder="Enter location or use auto-detect"
                      />
                    </div>
                  ) : (
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
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{ px: 4 }}
              >
                Search
              </Button>
            </div>
          </Card>

          {sortedDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              {sortedDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden font-[Poppins] flex flex-col shadow-xl"
                >
                  <div className="relative w-full aspect-[4/3]">
                    <img
                      src={
                        doctor.avatar ||
                        "https://www.sonicseo.com/wp-content/uploads/2020/07/surgeon-768x768.jpg"
                      }
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <h2 className="absolute bottom-2 left-4 text-white text-lg font-semibold z-10">
                      {doctor.name}
                    </h2>
                  </div>

                  <div className="flex flex-col justify-between flex-grow p-4 text-gray-100 bg-[#1C1C1E]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs bg-gray-700 px-3 py-1 rounded-full">
                        {doctor.experience}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-300">
                      <p>{doctor.specialty}</p>
                      <p>{doctor.location}</p>
                      <p>
                        <span className="text-gray-400">Timing:</span>{" "}
                        <span className="pl-2 text-white">
                          {doctor.availability}
                        </span>
                      </p>
                    </div>

                    <button
                      className="mt-5 bg-[#B8CFCE] text-black rounded-md py-2 font-medium hover:bg-[#a2bab9] transition-all duration-200"
                      onClick={() => {
                        getId(doctor._id);
                        navigate('/book-appointment');
                      }}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center text-[#888888] mt-10 text-lg">
              Search to find doctors in your area
            </div>
          )}
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default FindDoctors;
