import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Login = () => {
  const { login, isLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  useEffect(() => {
    if (isLogin) {
      navigate("/home", { replace: true });
    }
  }, [isLogin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-around">
      <div className="text-white p-8 rounded shadow-md w-full max-w-md ">
        <h2 className="text-3xl font-medium mb-8">Welcome Back !</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <ThemeProvider theme={darkTheme}>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
                autoComplete="off"
              />
            </ThemeProvider>
          </div>

          <div className="mb-6 ">
            <ThemeProvider theme={darkTheme}>
              <TextField
                id="outlined-basic"
                type="password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
                autoComplete="off"
              />
            </ThemeProvider>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#21848b] cursor-pointer text-white font-semibold py-2 px-4 rounded w-full"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <div className="hidden md:block w-2/7 h-[80vh] bg-[url('https://images.pexels.com/photos/3957986/pexels-photo-3957986.jpeg?auto=compress&cs=tinysrgb&w=3840')] bg-cover bg-center rounded-xl mt-12">

      </div>
    </div>
  );
};

export default Login;
