"use client";
import Layout from "@/components/LayoutWrapper";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "@/utils/dateFormatter";
import { Bell, ChevronLeft, ChevronRight, Loader2, Search, Filter, Calendar, X, Video, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  };

  // Pagination logic
  const indexOfLastNotification = currentPage * perPage;
  const indexOfFirstNotification = indexOfLastNotification - perPage;
  const currentNotifications = filteredNotifications?.slice(indexOfFirstNotification, indexOfLastNotification);
  const totalPages = Math.ceil(filteredNotifications?.length / perPage);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Notifications</h2>
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
            {filteredNotifications?.length} of {notifications?.length} Total
          </span>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
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
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
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
            
            <button 
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center justify-center gap-1"
            >
              <X size={14} /> Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-2" />
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        ) : filteredNotifications?.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-10 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            {notifications.length > 0 ? (
              <>
                <p className="text-gray-500 text-lg">No notifications match your filters</p>
                <button 
                  onClick={resetFilters}
                  className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                >
                  Reset filters
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-lg">No notifications available</p>
            )}
          </div>
        ) : (
          <div>
            <div className="divide-y divide-gray-200 rounded-xl overflow-hidden border border-gray-200">
              {currentNotifications?.map((notification) => (
                <div 
                  key={notification._id} 
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-blue-50 transition-colors cursor-pointer group border-b border-gray-100 ${
                    notification.submissionId ? 'border-l-4 border-l-blue-400' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon based on notification type */}
                    <div className={`p-2 rounded-full mt-1 ${
                      notification.isAdmin 
                        ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200' 
                        : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                    }`}>
                      {notification.isAdmin ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <Video className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-blue-700">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        By: <span className="font-medium">{notification.creatorName}</span>
                      </p>
                      
                      <div className="flex flex-wrap justify-between items-center mt-2">
                        <p className="text-sm text-gray-500">{formatDate(notification.createdAt)}</p>
                        
                        {notification.employeeName && (
                          <div className={`flex items-center text-sm px-2 py-1 rounded-full mt-1 ${
                            notification.isAdmin 
                              ? 'bg-blue-50 text-blue-600' 
                              : notification.employeeName === 'Unassigned'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-green-50 text-green-600'
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
                      
                      {notification.submissionId && (
                        <div className="mt-2 text-right">
                          <span className="text-xs text-blue-500 inline-flex items-center group-hover:text-blue-700 group-hover:font-medium">
                            View video <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 flex items-center gap-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <div className="text-sm font-medium text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 flex items-center gap-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
