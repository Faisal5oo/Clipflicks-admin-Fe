"use client";

import { useEffect, useState } from "react";
import { Download, Eye, Trash2, Loader2, Search, Filter, ArrowUpRight, X, Video } from "lucide-react";
import Layout from "@/components/LayoutWrapper";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [uniqueEmployees, setUniqueEmployees] = useState([]);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`/api/submissions`);
        setVideos(response.data);
        setFilteredVideos(response.data);
        
        // Extract unique employee names for filter dropdown
        const employeeNames = [...new Set(response.data.map(video => video.employeeName))];
        setUniqueEmployees(employeeNames);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let results = videos;
    
    // Filter by search term (check creator name and email)
    if (searchTerm) {
      results = results.filter(video => 
        (video.creatorName && video.creatorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (video.email && video.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by employee
    if (filterEmployee) {
      results = results.filter(video => video.employeeName === filterEmployee);
    }
    
    setFilteredVideos(results);
  }, [searchTerm, filterEmployee, videos]);

  // Function to download video
  const downloadVideo = (url, name) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = name || url.split("/").pop(); // Extract file name from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } catch (error) {
      toast.error("Download failed");
      console.error("Download error:", error);
    }
  };

  // Handle delete video
  const deleteVideo = async (id) => {
    if (window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      try {
        // Call DELETE API
        await axios.delete(`/api/submissions/${id}`);
        
        // Update local state after successful deletion
        const updatedVideos = videos.filter(video => video.id !== id);
        setVideos(updatedVideos);
        setFilteredVideos(updatedVideos.filter(video => 
          (!searchTerm || ((video.creatorName && video.creatorName.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (video.email && video.email.toLowerCase().includes(searchTerm.toLowerCase())))) &&
          (!filterEmployee || video.employeeName === filterEmployee)
        ));
        
        toast.success("Video deleted successfully");
      } catch (error) {
        console.error("Error deleting video:", error);
        toast.error("Failed to delete video");
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterEmployee("");
    setFilteredVideos(videos);
    toast.success("Filters reset");
  }

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6 mt-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Video Library</h1>
            <p className="text-gray-400">Manage and view all video submissions</p>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {filteredVideos.length} of {videos.length} Videos
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
                  placeholder="Search by creator or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-10 py-2 border border-gray-700 bg-gray-800/50 rounded-md leading-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filterEmployee}
                  onChange={(e) => setFilterEmployee(e.target.value)}
                >
                  <option value="">All Employees</option>
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
            <p className="text-gray-300">Loading videos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 text-red-400 p-4 rounded-lg flex items-center justify-center border border-red-800">
            <p>Error: {error}</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 shadow-md"
          >
            <div className="border-b border-gray-700 p-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Video className="h-5 w-5 mr-2 text-blue-400" />
                Video Submissions
              </h2>
              <Link 
                href="/videos" 
                className="text-blue-400 text-sm hover:text-blue-300 flex items-center transition-colors"
              >
                Refresh <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            
            {filteredVideos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/60">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Creator</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">URL</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredVideos.map((video, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        key={video.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-900/50 text-purple-400 rounded-full flex items-center justify-center mr-3">
                              <Video className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {video.creatorName || "Unknown"}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(video.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {video.email || "No Email"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {video.isAdmin ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Admin: {video.employeeName !== "Admin" ? video.employeeName : ""}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-800">
                              {video.employeeName === "Unassigned" ? "Unassigned" : video.employeeName}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap max-w-[200px]">
                          <a
                            href={video.videoURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 truncate block transition-colors text-sm flex items-center"
                          >
                            <span className="truncate max-w-[150px] inline-block">
                              {video?.videoURL || "No URL"}
                            </span>
                            <ArrowUpRight className="h-3 w-3 ml-1 flex-shrink-0" />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <motion.div whileHover={{ scale: 1.1 }}>
                              <Link
                                href={`/videos/${video.id}`}
                                className="p-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-800/50 transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </Link>
                            </motion.div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => deleteVideo(video.id)}
                              className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-800/50 transition-colors"
                              title="Delete Video"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => downloadVideo(video.videoURL, `video-${video.id}.mp4`)}
                              className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-800/50 transition-colors"
                              title="Download Video"
                            >
                              <Download size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400 bg-gray-800/20">
                <Video className="h-10 w-10 mx-auto mb-3 text-gray-500" />
                <p className="text-lg">No videos match your search criteria</p>
                <button 
                  onClick={resetFilters}
                  className="mt-3 px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 focus:outline-none"
                >
                  Reset filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default VideosPage;
