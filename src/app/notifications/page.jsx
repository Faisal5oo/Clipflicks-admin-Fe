"use client";
import Layout from "@/components/LayoutWrapper";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "@/utils/dateFormatter";
import { Bell, ChevronLeft, ChevronRight, Loader2, Search, Filter, Calendar, X, Video, ShieldCheck, User, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [uniqueEmployees, setUniqueEmployees] = useState([]);
  const router = useRouter();
  const perPage = 10; // Show 10 notifications per page

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications using Axios
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/notifications");
      setNotifications(data); 
      setFilteredNotifications(data);
      
      // Extract unique employee names for filter dropdown
      const employeeNames = [...new Set(data
        .filter(notification => notification.employeeName)
        .map(notification => notification.employeeName))];
      setUniqueEmployees(employeeNames);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking on a notification - navigate to video details
  const handleNotificationClick = (notification) => {
    if (notification.submissionId) {
      console.log("Navigating to submission:", notification.submissionId);
      router.push(`/videos/${notification.submissionId}`);
    } else {
      console.log("No submissionId found for this notification");
      toast.error("Video details not available");
    }
  };

  // Handle search and filtering
  useEffect(() => {
    let results = notifications;
    
    // Filter by search term (message content or creator name)
    if (searchTerm) {
      results = results.filter(notification => 
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by employee
    if (employeeFilter) {
      results = results.filter(notification => notification.employeeName === employeeFilter);
    }
    
    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      results = results.filter(notification => {
        const notificationDate = new Date(notification.createdAt);
        return (
          notificationDate.getDate() === filterDate.getDate() &&
          notificationDate.getMonth() === filterDate.getMonth() &&
          notificationDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }
    
    setFilteredNotifications(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, employeeFilter, dateFilter, notifications]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setEmployeeFilter("");
    setDateFilter("");
    setFilteredNotifications(notifications);
    toast.success("Filters reset");
  };

  // Pagination logic
  const indexOfLastNotification = currentPage * perPage;
  const indexOfFirstNotification = indexOfLastNotification - perPage;
  const currentNotifications = filteredNotifications?.slice(indexOfFirstNotification, indexOfLastNotification);
  const totalPages = Math.ceil(filteredNotifications?.length / perPage);

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mt-8 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Notifications</h2>
            <p className="text-gray-400">All system and user activity updates</p>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {filteredNotifications?.length} of {notifications?.length} Total
          </span>
        </div>
        
        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-gray-800 shadow-md"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 bg-gray-800/50 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 bg-gray-800/50 rounded-md leading-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-56">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-700 bg-gray-800/50 rounded-md leading-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                >
                  <option value="">All References</option>
                  {uniqueEmployees.map((employee, index) => (
                    <option key={index} value={employee}>
                      {employee}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-300 border border-gray-700 bg-gray-800/70 rounded-md hover:bg-gray-700 focus:outline-none flex items-center gap-1"
            >
              <X size={14} /> Reset
            </motion.button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-800 shadow-md">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-2" />
            <p className="text-gray-300">Loading notifications...</p>
          </div>
        ) : filteredNotifications?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-10 text-center border border-gray-800 shadow-md"
          >
            <Bell className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            {notifications.length > 0 ? (
              <>
                <p className="text-gray-300 text-lg">No notifications match your filters</p>
                <button 
                  onClick={resetFilters}
                  className="mt-3 px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none"
                >
                  Reset filters
                </button>
              </>
            ) : (
              <p className="text-gray-300 text-lg">No notifications available</p>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-gray-800"
          >
            <div className="border-b border-gray-700 p-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-400" />
                Activity Feed
              </h2>
              <button
                onClick={fetchNotifications}
                className="text-blue-400 text-sm hover:text-blue-300 flex items-center transition-colors"
              >
                Refresh <ArrowUpRight className="ml-1 h-3 w-3" />
              </button>
            </div>
            
            <div className="divide-y divide-gray-800">
              {currentNotifications?.map((notification, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={notification._id} 
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-5 hover:bg-white/5 transition-colors cursor-pointer group ${
                    notification.submissionId ? 'border-l-4 border-l-blue-500 pl-4' : 'border-l-4 border-l-transparent pl-4'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon based on notification type */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.isAdmin 
                        ? 'bg-blue-900/50 text-blue-400' 
                        : 'bg-purple-900/50 text-purple-400'
                    }`}>
                      {notification.isAdmin ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <Video className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-white group-hover:text-blue-300 transition-colors">
                        {notification.message}
                      </p>
                      <div className="flex items-center mt-1">
                        <User className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-400">
                          By: <span className="font-medium text-gray-300">{notification.creatorName}</span>
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                        
                        {notification.employeeName && (
                          <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                            notification.isAdmin 
                              ? 'bg-blue-900/30 text-blue-400 border border-blue-800' 
                              : notification.employeeName === 'Unassigned'
                                ? 'bg-gray-800/50 text-gray-400 border border-gray-700'
                                : 'bg-green-900/30 text-green-400 border border-green-800'
                          }`}>
                            {notification.isAdmin ? (
                              <ShieldCheck className="w-3 h-3 mr-1" />
                            ) : notification.employeeName === 'Unassigned' ? (
                              <User className="w-3 h-3 mr-1" />
                            ) : (
                              <User className="w-3 h-3 mr-1" />
                            )}
                            {notification.employeeName}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {notification.submissionId && (
                      <div className="self-center">
                        <div className="bg-blue-900/20 text-blue-400 p-2 rounded-lg hover:bg-blue-800/40 transition-colors">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 bg-gray-800/50 border-t border-gray-700">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-blue-400 hover:bg-blue-900/30'
                  }`}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-blue-400 hover:bg-blue-900/30'
                  }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Notifications;
