"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { PlusCircle, Eye, Pencil, Trash2, Loader2, Search, User, Mail } from "lucide-react";
import Layout from "@/components/LayoutWrapper";

const API_URL = "/api/employee/create";
const TOKEN = "YOUR_JWT_TOKEN_HERE";

const Users = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "" });
  const [editEmployee, setEditEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/employee/`);
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        emp => 
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) return;

    try {
      await axios.post(`/api/employee/create`, newEmployee);
      setNewEmployee({ name: "", email: "" });
      fetchEmployees(); // Refetch employees
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) return;
    
    try {
      await axios.delete(`/api/employee/${id}`);
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
      await axios.put(`/api/employee/${editEmployee._id}`, editEmployee);
      setShowEditModal(false);
      fetchEmployees(); // Refetch employees
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mt-8">
          <h1 className="text-3xl font-bold text-white mb-8">Employees</h1>
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
            {filteredEmployees.length} Total
          </span>
        </div>

        {/* Add Employee Form */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <PlusCircle className="mr-2 text-blue-500" size={20} />
            Add New Employee
          </h2>
          <form onSubmit={addEmployee}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Employee Name"
                  value={newEmployee.name}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={newEmployee.email}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={18} /> Add Employee
            </button>
          </form>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee List</h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-2" />
              <p className="text-gray-500">Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <User size={40} className="mx-auto mb-3 text-gray-300" />
              {employees.length > 0 ? (
                <p className="text-lg">No employees match your search</p>
              ) : (
                <p className="text-lg">No employees added yet</p>
              )}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((emp, index) => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="p-3 text-sm font-medium text-gray-800">{emp.name}</td>
                    <td className="p-3 text-sm text-gray-500">{emp.email}</td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <Link href={`/users/${emp._id}`}>
                          <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                            <Eye size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => openEditModal(emp)}
                          className="p-2 bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => deleteEmployee(emp._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && editEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Employee</h2>
              <form onSubmit={updateEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editEmployee.name}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editEmployee.email}
                    onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button 
                    type="submit" 
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setShowEditModal(false)} 
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
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
