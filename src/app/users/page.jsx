"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { PlusCircle, Eye, Pencil, Trash2, Loader2, Search, User, Mail, ArrowUpRight, Users as UsersIcon } from "lucide-react";
import Layout from "@/components/LayoutWrapper";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

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
      toast.error("Failed to load employees");
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
      toast.success("Employee added successfully");
    } catch (error) {
      console.error("Error adding employee", error);
      toast.error("Failed to add employee");
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) return;
    
    try {
      await axios.delete(`/api/employee/${id}`);
      fetchEmployees(); // Refetch employees
      toast.success("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee", error);
      toast.error("Failed to delete employee");
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
      toast.success("Employee updated successfully");
    } catch (error) {
      console.error("Error updating employee", error);
      toast.error("Failed to update employee");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mt-8 mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Employees</h1>
            <p className="text-gray-400">Manage employee accounts and details</p>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {filteredEmployees.length} Total
          </span>
        </motion.div>

        {/* Add Employee Form */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-md mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <PlusCircle className="mr-2 text-blue-400" size={20} />
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
                  className="pl-10 w-full border border-gray-700 bg-gray-800/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
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
                  className="pl-10 w-full border border-gray-700 bg-gray-800/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  required
                />
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="mt-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
            >
              <PlusCircle size={18} /> Add Employee
            </motion.button>
          </form>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-md mb-6"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-700 bg-gray-800/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>
        </motion.div>

        {/* Employee List */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-gray-800 shadow-md mb-6 overflow-hidden"
        >
          <div className="border-b border-gray-700 p-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-blue-400" />
              Employee List
            </h2>
            <button 
              onClick={fetchEmployees} 
              className="text-blue-400 text-sm hover:text-blue-300 flex items-center transition-colors"
            >
              Refresh <ArrowUpRight className="ml-1 h-3 w-3" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-2" />
              <p className="text-gray-300">Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="py-12 text-center text-gray-400 bg-gray-800/20">
              <User size={40} className="mx-auto mb-3 text-gray-500" />
              {employees.length > 0 ? (
                <p className="text-lg">No employees match your search</p>
              ) : (
                <p className="text-lg">No employees added yet</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-800/60">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredEmployees.map((emp, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      key={emp._id} 
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-300 flex items-center justify-center">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-900/50 text-purple-400 rounded-full flex items-center justify-center mr-3">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="text-sm font-medium text-white">
                            {emp.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {emp.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Link href={`/users/${emp._id}`}>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              className="p-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-800/50 transition-colors"
                            >
                              <Eye size={16} />
                            </motion.button>
                          </Link>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            onClick={() => openEditModal(emp)}
                            className="p-2 bg-amber-900/30 text-amber-400 rounded-lg hover:bg-amber-800/50 transition-colors"
                          >
                            <Pencil size={16} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            onClick={() => deleteEmployee(emp._id)}
                            className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-800/50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Edit Modal */}
        {showEditModal && editEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-xl max-w-md w-full"
            >
              <h2 className="text-xl font-bold text-white mb-4">Edit Employee</h2>
              <form onSubmit={updateEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editEmployee.name}
                    onChange={handleEditChange}
                    className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editEmployee.email}
                    onChange={handleEditChange}
                    className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-colors"
                  >
                    Save Changes
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEditModal(false)} 
                    className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
