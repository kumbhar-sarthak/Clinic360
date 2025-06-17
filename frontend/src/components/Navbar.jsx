import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, isLogin, logout, isregister } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLogin && isregister) {
      navigate("/", { replace: true });
    }
  }, [isLogin, isregister, navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate("/", { replace: true });
  };

  return (
    <nav className="text-black p-4  text-white absolute top-0 w-full z-999">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold title">
            Clinic360
          </Link>
        </div>

        <button
          className="sm:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <span className="text-2xl">✖</span>
          ) : (
            <span className="text-2xl text-white">☰</span>
          )}
        </button>

        <div className="hidden sm:flex space-x-4">
          {user && isLogin ? (
            <button
              onClick={handleLogout}
              className="text-[#8E1616] cursor-pointer"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? window.location.reload() : "Logout"}
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Signup</Link>
            </>
          )}

          {isLogin && <Link to="/profile">Profile</Link>}
        </div>
      </div>

      <div
        className={`sm:hidden fixed top-0 left-0 w-full bg-black text-white shadow-lg transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ height: "-webkit-fill-available", zIndex: 10, }}
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-4 relative h-full">
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={() => setMenuOpen(false)}
          >
            ✖
          </button>
          
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-600 cursor-pointer"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Signup
              </Link>
            </>
          )}
          {isLogin && (
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
