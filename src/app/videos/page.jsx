"use client";

import { useEffect, useState } from "react";
import { Download, Eye, Trash2, Loader2, Search, Filter, ArrowUpRight, X, Video, ChevronLeft, ChevronRight, Calendar, List, GridIcon } from "lucide-react";
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(8);
  const [viewMode, setViewMode] = useState("table"); // table or grid

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
    setCurrentPage(1); // Reset to first page when filters change
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
  
  // Pagination calculations
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => prev < totalPages ? prev + 1 : prev);
  const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : prev);

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
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
            >
              <GridIcon size={18} />
            </button>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium ml-2">
              {filteredVideos.length} of {videos.length} Videos
            </span>
          </div>
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
              
              <div className="flex items-center space-x-4">
                <select
                  value={videosPerPage}
                  onChange={(e) => {
                    setVideosPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="8">8 per page</option>
                  <option value="12">12 per page</option>
                  <option value="16">16 per page</option>
                  <option value="24">24 per page</option>
                </select>
                
                <Link 
                  href="/videos" 
                  className="text-blue-400 text-sm hover:text-blue-300 flex items-center transition-colors"
                >
                  Refresh <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
            
            {filteredVideos.length > 0 ? (
              <>
                {viewMode === "table" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/60">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Creator</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">URL</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {currentVideos.map((video, index) => (
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
                              <div className="flex items-center text-sm text-gray-300">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {new Date(video.createdAt).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-300">
                                {video.videoURL ? (
                                  <a
                                    href={video.videoURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 truncate max-w-[200px]"
                                  >
                                    {video.videoURL}
                                  </a>
                                ) : (
                                  <span className="text-gray-500">No URL</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link 
                                  href={`/videos/${video.id}`}
                                  className="text-blue-400 hover:text-blue-300 p-1"
                                >
                                  <Eye className="h-5 w-5" />
                                </Link>
                                {video.rawVideo && (
                                  <button
                                    onClick={() => downloadVideo(video.rawVideo)}
                                    className="text-green-400 hover:text-green-300 p-1"
                                  >
                                    <Download className="h-5 w-5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteVideo(video.id)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentVideos.map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-800/40 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                <Video className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {video.creatorName || "Unknown"}
                                </div>
                                <div className="text-xs text-gray-400 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(video.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-300 mb-2">
                            <strong>Email:</strong> {video.email || "No Email"}
                          </div>
                          
                          {video.videoURL && (
                            <div className="text-sm mb-3">
                              <a
                                href={video.videoURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 truncate block"
                              >
                                <span className="text-gray-400">URL:</span> {video.videoURL.substring(0, 30)}...
                              </a>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                            <Link
                              href={`/videos/${video.id}`}
                              className="px-3 py-1.5 bg-blue-600/40 text-blue-300 rounded hover:bg-blue-600/60 transition-colors text-sm flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View Details
                            </Link>
                            
                            <div className="flex items-center space-x-2">
                              {video.rawVideo && (
                                <button
                                  onClick={() => downloadVideo(video.rawVideo)}
                                  className="p-1.5 bg-green-600/30 text-green-300 rounded hover:bg-green-600/50 transition-colors"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteVideo(video.id)}
                                className="p-1.5 bg-red-600/30 text-red-300 rounded hover:bg-red-600/50 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing <span className="font-medium text-white">{indexOfFirstVideo + 1}</span> to{" "}
                    <span className="font-medium text-white">
                      {indexOfLastVideo > filteredVideos.length ? filteredVideos.length : indexOfLastVideo}
                    </span>{" "}
                    of <span className="font-medium text-white">{filteredVideos.length}</span> videos
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md border ${
                        currentPage === 1
                          ? "border-gray-700 text-gray-600 cursor-not-allowed"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => {
                      // Only show 5 page numbers centered around current page
                      if (
                        totalPages <= 5 ||
                        i === 0 ||
                        i === totalPages - 1 ||
                        Math.abs(currentPage - (i + 1)) <= 1
                      ) {
                        return (
                          <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`w-10 h-10 rounded-md ${
                              currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      } else if (
                        (i === 1 && currentPage > 3) ||
                        (i === totalPages - 2 && currentPage < totalPages - 2)
                      ) {
                        // Show ellipsis
                        return <span key={i} className="text-gray-500">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-md border ${
                        currentPage === totalPages
                          ? "border-gray-700 text-gray-600 cursor-not-allowed"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No videos found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterEmployee
                    ? "Try adjusting your search filters"
                    : "No videos have been submitted yet."}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default VideosPage;
