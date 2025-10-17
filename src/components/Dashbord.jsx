import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const pageSize = 10;

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in first!");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `http://127.0.0.1:8000/dashbord/users/?page=${page}&search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load users");

      const data = await res.json();
      setUsers(data.results);
      setTotalUsers(data.count);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (err) {
      setError("Failed to load users. Please login first!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:8000/dashbord/users/${userId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const getPaginationRange = () => {
    const totalNumbers = 5;
    let start = Math.max(1, page - Math.floor(totalNumbers / 2));
    let end = Math.min(totalPages, start + totalNumbers - 1);
    if (end - start < totalNumbers - 1) {
      start = Math.max(1, end - totalNumbers + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="bg-gradient-to-br mt-5 from-gray-50 to-blue-50 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          User Dashboard
        </h1>

        <div className="text-center mb-6 text-gray-700 font-semibold text-lg">
          Total Users: <span className="text-blue-600">{totalUsers}</span>
        </div>

        {/* Search bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* User table */}
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse text-lg">
            Loading users...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 font-medium">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-xl shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">First Name</th>
                  <th className="py-3 px-4 text-left">Last Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 font-medium"
                    >
                      No users found 😔
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="py-3 px-4">{user.first_name}</td>
                      <td className="py-3 px-4">{user.last_name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        {user.is_superuser
                          ? "Superuser"
                          : user.is_staff
                          ? "Staff"
                          : "User"}
                      </td>
                      <td className="py-3 px-4 text-center flex justify-center gap-3">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 shadow-sm transition"
                          onClick={() => setSelectedUser(user)}
                        >
                          View
                        </button>
                        {!user.is_superuser && (
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 shadow-sm transition"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50"
            >
              Prev
            </button>
            {getPaginationRange().map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded-lg transition ${
                  num === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
                User Details
              </h2>
              <p>
                <strong>Name:</strong> {selectedUser.first_name}{" "}
                {selectedUser.last_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedUser.is_superuser
                  ? "Superuser"
                  : selectedUser.is_staff
                  ? "Staff"
                  : "User"}
              </p>
              <div className="flex justify-center mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
