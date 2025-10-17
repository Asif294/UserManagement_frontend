import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [loginCount, setLoginCount] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

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
      let fetchedUsers = data.results;

      // Filtering
      if (roleFilter !== "all") {
        fetchedUsers = fetchedUsers.filter((u) =>
          roleFilter === "superuser"
            ? u.is_superuser
            : roleFilter === "staff"
            ? u.is_staff && !u.is_superuser
            : !u.is_staff && !u.is_superuser
        );
      }

      // Sorting by first name
      fetchedUsers.sort((a, b) =>
        sortOrder === "asc"
          ? a.first_name.localeCompare(b.first_name)
          : b.first_name.localeCompare(a.first_name)
      );

      // Update all counts
      const total = data.count;
      const staff = data.results.filter(
        (u) => u.is_staff && !u.is_superuser
      ).length;
      const active = data.results.filter((u) => u.is_active).length; // 🔹 Login users
      setUsers(fetchedUsers);
      setTotalUsers(total);
      setStaffCount(staff);
      setLoginCount(active);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (err) {
      setError("Failed to load users. Please login first!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, sortOrder]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:8000/dashbord/users/${userId}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:8000/dashbord/users/${editUser.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(editUser),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      const updatedUser = await res.json();

      // Update local state immediately (without full reload)
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );

      setEditUser(null);
      fetchUsers(); // reload counts and sync pagination
    } catch (err) {
      alert("Failed to update user");
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

  const Card = ({ title, count, color }) => (
    <div
      className={`shadow-md rounded-xl px-6 py-4 text-center border ${color}`}
    >
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      <p className="text-3xl font-bold text-blue-800">{count}</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-blue-700">Admin Dashboard</h1>
          <div className="flex gap-4 flex-wrap">
            <Card title="Total Users" count={totalUsers} color="border-blue-300" />
            <Card title="Logged-in Users" count={loginCount} color="border-green-300" />
            <Card title="Staff Count" count={staffCount} color="border-orange-300" />
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="superuser">Superuser</option>
            <option value="staff">Staff</option>
            <option value="user">User</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sort by Name ({sortOrder === "asc" ? "A→Z" : "Z→A"})
          </button>
        </div>

        {/* Table */}
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
                    <td colSpan="5" className="text-center py-6 text-gray-500">
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
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                          onClick={() => setSelectedUser(user)}
                        >
                          View
                        </button>
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                          onClick={() => setEditUser(user)}
                        >
                          Edit
                        </button>
                        {!user.is_superuser && (
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
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
            {page < totalPages - 2 && <span>...</span>}
            {page !== totalPages && (
              <button
                onClick={() => setPage(totalPages)}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                {totalPages}
              </button>
            )}
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
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[28rem] relative animate-fadeIn">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
              <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">
                👤 User Profile
              </h2>
              <div className="space-y-3 text-lg text-gray-700">
                <p>
                  <strong>Name:</strong> {selectedUser.first_name}{" "}
                  {selectedUser.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  {selectedUser.is_superuser
                    ? "Superuser"
                    : selectedUser.is_staff
                    ? "Staff"
                    : "User"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.is_active ? "Active ✅" : "Inactive ❌"}
                </p>
                <p>
                  <strong>User ID:</strong> #{selectedUser.id}
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[26rem] relative animate-fadeIn"
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setEditUser(null)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
                ✏️ Edit User
              </h2>
              <input
                type="text"
                className="border w-full mb-3 px-3 py-2 rounded"
                value={editUser.first_name}
                onChange={(e) =>
                  setEditUser({ ...editUser, first_name: e.target.value })
                }
                placeholder="First Name"
              />
              <input
                type="text"
                className="border w-full mb-3 px-3 py-2 rounded"
                value={editUser.last_name}
                onChange={(e) =>
                  setEditUser({ ...editUser, last_name: e.target.value })
                }
                placeholder="Last Name"
              />
              <input
                type="email"
                className="border w-full mb-3 px-3 py-2 rounded"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                placeholder="Email"
              />
              <select
                className="border w-full mb-3 px-3 py-2 rounded"
                value={
                  editUser.is_superuser
                    ? "superuser"
                    : editUser.is_staff
                    ? "staff"
                    : "user"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setEditUser({
                    ...editUser,
                    is_superuser: val === "superuser",
                    is_staff: val === "staff",
                  });
                }}
              >
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="superuser">Superuser</option>
              </select>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
