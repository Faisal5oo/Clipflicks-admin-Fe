"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react";
import Layout from "@/components/LayoutWrapper";

const API_URL = "http://localhost:5000/api/users";
const TOKEN = "YOUR_JWT_TOKEN_HERE";

const Users = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "" });
  const [editEmployee, setEditEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) return;

    try {
      await axios.post(`${API_URL}/create`, newEmployee, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setNewEmployee({ name: "", email: "" });
      fetchEmployees(); // Refetch employees
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      fetchEmployees(); // Refetch employees
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const openEditModal = (employee) => {
    setEditEmployee(employee);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
  };

  const updateEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/edit/${editEmployee._id}`, editEmployee, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      setShowEditModal(false);
      fetchEmployees(); // Refetch employees
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-gray-900 to-black">
        <h1 className="text-3xl font-bold text-white mb-6">Employees</h1>

        {/* Add Employee Form */}
        <form onSubmit={addEmployee} className="bg-white text-black p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newEmployee.name}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow">
            <PlusCircle size={18} /> Add Employee
          </button>
        </form>

        {/* Employee List */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto text-black">
          <h2 className="text-xl font-semibold mb-4">Employee List</h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading employees...</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3 flex gap-4">
                      <Link href={`/users/${emp._id}`} className="text-blue-600 hover:underline">
                        <Eye size={20} className="text-blue-600 cursor-pointer" />
                      </Link>
                      <button onClick={() => openEditModal(emp)}>
                        <Pencil size={20} className="text-yellow-600 cursor-pointer" />
                      </button>
                      <button onClick={() => deleteEmployee(emp._id)}>
                        <Trash2 size={20} className="text-red-600 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && editEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
              <form onSubmit={updateEmployee} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={editEmployee.name}
                  onChange={handleEditChange}
                  className="p-2 border rounded w-full"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={editEmployee.email}
                  onChange={handleEditChange}
                  className="p-2 border rounded w-full"
                  required
                />
                <div className="flex gap-4">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow">
                    Save Changes
                  </button>
                  <button onClick={() => setShowEditModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded shadow">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
