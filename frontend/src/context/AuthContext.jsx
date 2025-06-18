import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [profile, setProfile] = useState({ role: "" });
  const [getappointment, setAppointment] = useState(null);
  const [getdoctorId,setdoctorId] = useState("");

  

  const refresh = async () => {
    try {
      const res = await fetch(`api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsLogin(true);
      } else {
        setIsLogin(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      setIsLogin(false);
      setUser(null);
    }
  };


  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 1000 * 60 * 10);

    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      setIsLogin(true);
      setUser(data.user);
      setIsRegister(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (formData) => {
    const URL =
      formData.role === "doctor"
        ? `api/auth/register/doctor`
        : `api/auth/register`;

    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Registration failed");

      const data = await res.json();
      setUser(data.user);
      setIsRegister(true);
      setProfile({ role: formData.role });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLogin(false);
        setUser(null);
        setIsRegister(false);
        setProfile({ role: "" });
        setAppointment(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getDoctorInfo = async (_id) => {
    try {
      const res = await fetch(`api/doctor/me?userId=${_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Get doctor info failed");

      return await res.json();
    } catch (error) {
      console.error("Get doctor info error:", error);
      throw error;
    }
  };

  const bookAppointment = async (doctorid, date, time, reason, _id) => {
    try {
      const res = await fetch(`api/appointment/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorid, date, time, reason, _id }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Appointment Not Booked");

      const data = await res.json();
      setAppointment(data);
    } catch (err) {
      console.error("Appointment booking error:", err);
      throw new Error(`Appointment Not Booked: ${err.message}`);
    }
  };

  const updateDoctorInfo = async (doctorId, updatedData) => {
    try {
      const response = await fetch(`api/doctor/${doctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Doctor update failed");
      }

      setProfile(result.doctor);
      return result;
    } catch (error) {
      console.error("Update doctor info error:", error);
      throw error;
    }
  };

  const getId = (doctorid) =>{
    setdoctorId(doctorid);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogin,
        isRegister,
        profile,
        getappointment,
        getdoctorId,
        login,
        logout,
        register,
        getDoctorInfo,
        bookAppointment,
        updateDoctorInfo,
        getId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
