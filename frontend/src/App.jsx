import "./App.css";
import "./nprogress-custom.css"
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProfilePage from "./components/Profile.jsx";
import FindDoctors from "./pages/FindDoctors.jsx";
import Appointment from "./pages/Appointment.jsx";
import ListAppointments from "./pages/ListAppointment.jsx";

NProgress.configure({ showSpinner: false, speed: 500, easing: "ease-in-out", });

const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    NProgress.start();

    const timer = setTimeout(() => {
      setLoading(false);
      NProgress.done();
    }, 1500); 

    return () => clearTimeout(timer);
  }, [location]);

  return loading ? null : (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProfilePage />} /> 
      <Route path="/search/doctors" element={<FindDoctors />} /> 
      <Route path="/book-appointment" element={<Appointment />} /> 
      <Route path="/list-appointments" element={<ListAppointments />} /> 
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
