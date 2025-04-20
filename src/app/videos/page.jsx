"use client";

import { useEffect, useState } from "react";
import { Download, Eye, Trash2 } from "lucide-react";
import Layout from "@/components/LayoutWrapper";
import axios from "axios";
import Link from "next/link";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`/api/submissions`);
        setVideos(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);


  // Function to download video
  const downloadVideo = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // Extract file name from URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
const deleteVideo = async (id) => {
  try {
    // Call DELETE API
    await axios.delete(`/api/submissions/${id}`);
    
    // Update local state after successful deletion
    setVideos((prev) => prev.filter((video) => video.id !== id));
    
    console.log(`Video with ID ${id} deleted.`);
  } catch (error) {
    console.error("Error deleting video:", error);
  }
};

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Videos</h1>

        {loading ? (
          <p className="text-gray-600">Loading videos...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 min-w-[800px]">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="border border-gray-600 px-4 py-2">Preview</th>
                  <th className="border border-gray-600 px-4 py-2">
                    Video URL
                  </th>
                  <th className="border border-gray-600 px-4 py-2">Creator</th>
                  <th className="border border-gray-600 px-4 py-2">Email</th>
                  <th className="border border-gray-600 px-4 py-2">Employee</th>
                  <th className="border border-gray-600 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr
                    key={video.id}
                    className="hover:bg-gray-100 text-gray-700"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      <video
                        width="200"
                        height="120"
                        controls
                        className="rounded-lg shadow-md"
                      >
                        <source src={video.videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <a
                        href={video.videoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {video?.videoURL?.length > 30
                          ? video.videoURL.slice(0, 30) + "..."
                          : video.videoURL}
                      </a>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {video.creatorName || "Unknown"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {video.email || "No Email"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {video.employeeName || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-4">
                      <Link
                        href={`/videos/${video.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Eye size={20} />
                      </Link>
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={() => downloadVideo(video.rawvideo)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Download size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VideosPage;
