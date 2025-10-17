import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch profile data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErr("Please login first!");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/account/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 403)
            setErr("Access forbidden. Please login again.");
          throw new Error("Failed to fetch profile!");
        }

        const data = await res.json();
        setProfile(data);
        setFormData({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
        setErr("Failed to fetch profile data!");
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Save updated info
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErr("You must be logged in to update your profile!");
      return;
    }

    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const res = await fetch("http://127.0.0.1:8000/account/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update!");

      const updatedData = await res.json();
      setProfile(updatedData);
      setMsg("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setErr("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg animate-pulse">
        Loading...
      </p>
    );

  // ✅ Determine user role
  let userRole = "User 👤";
  if (profile.is_superuser) userRole = "Superuser (Admin) 🛠️";
  else if (profile.is_staff) userRole = "Staff 👔";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          My Profile
        </h2>

        {err && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center mb-4">
            {err}
          </div>
        )}
        {msg && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center mb-4">
            {msg}
          </div>
        )}

        {/* Profile Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              disabled
              className="w-full px-4 py-2 border rounded-xl bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 ${
                  !editMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 ${
                  !editMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border rounded-xl bg-gray-100 cursor-not-allowed"
            />
          </div>

         

          {/* 🔹 User Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Role
            </label>
            <span
              className={`inline-block px-4 py-2 rounded-xl font-semibold text-white ${
                profile.is_superuser
                  ? "bg-purple-600"
                  : profile.is_staff
                  ? "bg-blue-600"
                  : "bg-gray-600"
              }`}
            >
              {userRole}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-3">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-semibold px-5 py-2 rounded-xl`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
