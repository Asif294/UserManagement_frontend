import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // <-- track route changes
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("token"));
  const [isSuperuser, setIsSuperuser] = useState(
    localStorage.getItem("is_superuser") === "true"
  );
  const [isStaff, setIsStaff] = useState(
    localStorage.getItem("is_staff") === "true"
  );

  
  useEffect(() => {
    setUser(localStorage.getItem("token"));
    setIsSuperuser(localStorage.getItem("is_superuser") === "true");
    setIsStaff(localStorage.getItem("is_staff") === "true");
  }, [location]); 

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl md:text-3xl font-extrabold text-blue-700 tracking-tight"
          >
            User<span className="text-gray-800">Manage</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              Home
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `font-medium transition ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`
                  }
                >
                  Profile
                </NavLink>

                {(isSuperuser || isStaff) && (
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `font-medium transition ${
                        isActive
                          ? "text-yellow-500 border-b-2 border-yellow-500"
                          : "text-gray-700 hover:text-yellow-500"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                )}

                <NavLink
                  to="/logout"
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium shadow-sm"
                >
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-sm"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none transition"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-md rounded-b-2xl mt-1">
              <div className="px-6 py-4 space-y-3">
                <NavLink
                  to="/"
                  className="block text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Home
                </NavLink>

                {user ? (
                  <>
                    <NavLink
                      to="/profile"
                      className="block text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                      Profile
                    </NavLink>

                    {(isSuperuser || isStaff) && (
                      <NavLink
                        to="/dashboard"
                        className="block text-gray-700 hover:text-yellow-500 transition font-medium"
                      >
                        Dashboard
                    </NavLink>
                    )}

                    <NavLink
                      to="/logout"
                      className="block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-center"
                    >
                      Logout
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-center"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="block text-gray-700 hover:text-blue-600 transition font-medium text-center"
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
