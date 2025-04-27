"use client";

import { useEffect, useState } from "react";
import { Download, Eye, Trash2, Loader2, Search, Filter, SlidersHorizontal, ShieldCheck } from "lucide-react";
import Layout from "@/components/LayoutWrapper";
import axios from "axios";
import Link from "next/link";

const AdminVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [admin, setAdmin] = useState(null);

  // Fetch the current admin user from localStorage
  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      const parsedAdmin = JSON.parse(adminData);
      setAdmin(parsedAdmin);
    }
  }, []);

  // Fetch admin-specific videos from API
  useEffect(() => {
    if (!admin?._id) return;

    const fetchAdminVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/${admin._id}/videos`);
        setVideos(response.data);
        setFilteredVideos(response.data);
      } catch (err) {
        console.error("Error fetching admin videos:", err);
        setError(err.message || "Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminVideos();
  }, [admin]);

  // Handle search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video => 
        (video.creatorName && video.creatorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (video.email && video.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

  // Function to download video
  const downloadVideo = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // Extract file name from URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          !searchTerm || 
          ((video.creatorName && video.creatorName.toLowerCase().includes(searchTerm.toLowerCase())) || 
           (video.email && video.email.toLowerCase().includes(searchTerm.toLowerCase())))
        ));
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilteredVideos(videos);
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ShieldCheck className="mr-2 text-blue-500" />
            Admin Videos
          </h1>
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
            {filteredVideos.length} of {videos.length} Videos
          </span>
        </div>
        
        {/* Search */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by creator or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset
            </button>
          </div>
        </div>

        {!admin ? (
          <div className="py-12 text-center text-gray-500">
            <ShieldCheck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-lg">Login required</p>
            <p className="text-sm mt-1">Please log in as an admin to view your videos</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-2" />
            <p className="text-gray-600">Loading admin videos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg flex items-center justify-center">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            {filteredVideos.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Creator</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">URL</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.map((video, index) => (
                    <tr
                      key={video.id}
                      className={`hover:bg-gray-50 text-gray-700 border-t border-gray-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">
                        {video.creatorName || "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        {video.email || "No Email"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(video.createdAt).toLocaleDateString()} 
                        <span className="text-xs text-gray-500 ml-1">
                          {new Date(video.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={video.videoURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 hover:underline transition-colors flex items-center gap-1"
                        >
                          {video?.videoURL?.length > 25
                            ? video.videoURL.slice(0, 25) + "..."
                            : video.videoURL}
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                            />
                          </svg>
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/videos/${video.id}`}
                            className="p-2 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => deleteVideo(video.id)}
                            className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                            title="Delete Video"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => downloadVideo(video.videoURL)}
                            className="p-2 bg-green-50 text-green-500 rounded-full hover:bg-green-100 transition-colors"
                            title="Download Video"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <SlidersHorizontal className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                {videos.length > 0 ? (
                  <>
                    <p className="text-lg">No videos match your search</p>
                    <button 
                      onClick={resetFilters}
                      className="mt-3 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                    >
                      Reset filters
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-lg">No admin videos available</p>
                    <p className="text-sm mt-1">Videos submitted with your admin reference will appear here</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminVideosPage; 