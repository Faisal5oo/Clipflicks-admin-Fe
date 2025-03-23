"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Layout from "@/components/LayoutWrapper";
import { Loader2, AlertCircle } from "lucide-react";

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/${id}`);
        setVideo(response.data);
      } catch (err) {
        setError("Failed to load video details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
          <p className="ml-2 text-gray-700">Loading video details...</p>
        </div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen text-red-500">
          <AlertCircle size={32} />
          <p className="mt-2">{error}</p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {video.title || "Video Details"}
        </h1>

        {/* Video Player */}
        <div className="mb-6">
          <video
            width="100%"
            height="auto"
            controls
            className="rounded-lg shadow-md"
          >
            <source src={video.rawVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">Creator Name:</span>{" "}
              {video.creatorName || "Unknown"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span>{" "}
              {video.email || "No Email"}
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">Social Media handle:</span>{" "}
              <a
                className="text-blue-500"
                target="_blank"
                href={`${video.socialHandle}`}
              >
                {video.socialHandle}
              </a>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Video URL:</span>{" "}
              <a
                href={video.videoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {video.videoURL}
              </a>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Download Video File:</span>{" "}
              <a
                href={video.rawVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Open the Video link
              </a>
            </p>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Additional Details
          </h2>
          <p className="text-gray-700">
            <span className="font-semibold">Is Recored by the Creator:</span>{" "}
            {video.recordedVideo === true ? "✅" : "❌"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">
              Is the video is uploaded somewhere else:
            </span>{" "}
            {video.notUploadedElsewhere === true ? "✅" : "❌"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">
              Is the creator is 18 years old:
            </span>{" "}
            {video.agreed18 === true ? "✅" : "❌"}
          </p>
        </div>

        {/* Employee Details */}
        {video.employee && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Employee Details
            </h2>
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {video.employee.name}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span>{" "}
              {video.employee.email}
            </p>
            {/* <p className="text-gray-700">
              <span className="font-semibold">Position:</span> {video.employee.position}
            </p> */}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          ← Go Back
        </button>
      </div>
    </Layout>
  );
};

export default VideoDetails;
