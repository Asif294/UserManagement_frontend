import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token, just navigate to login
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/account/logout/", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, 
          },
        });

        if (!res.ok) {
          console.error("Logout failed:", res.statusText);
        }

        // Clear localStorage in any case
        localStorage.removeItem("token");
        localStorage.removeItem("is_superuser");
        localStorage.removeItem("is_staff");

        // Redirect to login
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <p className="text-lg font-semibold text-gray-600">
        Logging out, please wait...
      </p>
    </div>
  );
};

export default Logout;
