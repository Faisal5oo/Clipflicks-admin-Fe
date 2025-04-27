"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Layout from "@/components/LayoutWrapper";
import { Loader2, AlertCircle, Mail, User, Globe, Link as LinkIcon, Calendar, Check, Download, FileVideo, XCircle, Instagram, Youtube, Users, Info } from "lucide-react";

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`/api/submissions/${id}`);
        setVideo(response.data);
      } catch (err) {
        setError("Failed to load video details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  // Function to handle social media links with proper protocol
  const formatSocialLink = (handle) => {
    if (!handle) return null;
    
    const handleLower = handle.toLowerCase();
    
    if (handleLower.includes("instagram") || handleLower.includes("insta.")) {
      return { 
        url: handle.startsWith("http") ? handle : `https://${handle}`,
        type: "Instagram",
        icon: <Instagram className="w-4 h-4 text-pink-500" />
      };
    } else if (handleLower.includes("youtube") || handleLower.includes("youtu.be")) {
      return { 
        url: handle.startsWith("http") ? handle : `https://${handle}`,
        type: "YouTube",
        icon: <Youtube className="w-4 h-4 text-red-500" />
      };
    } else if (handleLower.includes("tiktok")) {
      return { 
        url: handle.startsWith("http") ? handle : `https://${handle}`,
        type: "TikTok",
        icon: <LinkIcon className="w-4 h-4 text-black" />
      };
    } else {
      return { 
        url: handle.startsWith("http") ? handle : `https://${handle}`,
        type: "Social Handle",
        icon: <LinkIcon className="w-4 h-4 text-blue-500" />
      };
    }
  };

  // Function to display recordedBy options clearly
  const getRecordedByLabel = (value) => {
    if (!value) return "Not specified";
    
    const options = {
      "Me": "Recorded by creator themselves",
      "Friend": "Recorded by a friend",
      "Family": "Recorded by a family member",
      "Other": "Recorded by someone else"
    };
    
    return options[value] || value;
  };

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

  const socialLink = formatSocialLink(video.socialHandle);

  return (
    <Layout>
      <div className="bg-white shadow-lg rounded-xl p-6 mt-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 truncate">
            {video.title || "Video Details"}
          </h1>
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
            ID: {video.id}
          </span>
        </div>

        {/* Video Player - with constrained height */}
        <div className="mb-6 overflow-hidden rounded-xl shadow-lg bg-black">
          <div className="aspect-video max-h-[500px] relative">
            <video
              width="100%"
              height="100%"
              controls
              className="rounded-lg mx-auto max-h-full object-contain"
              poster={video.videoURL}
            >
              <source src={video.rawVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap gap-3 mb-6">
          <a
            href={video.rawVideo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download size={18} /> Download Raw Video
          </a>
          {/* <a
            href={video.videoURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex s-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            <FileVideo size={18} /> View Original Video
          </a> */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
          >
            ← Go Back
          </button>
        </div>

        {/* Video Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="text-blue-500" /> Creator Information
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-32">Full Name:</span>
                  <span>{video.firstName} {video.lastName}</span>
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <Mail className="text-gray-500 w-4 h-4" />
                  <span className="font-semibold w-32">Email:</span>
                  <span className="break-all">{video.email || "No Email"}</span>
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <Globe className="text-gray-500 w-4 h-4" />
                  <span className="font-semibold w-32">Country:</span>
                  <span>{video.country || "Not specified"}</span>
                </p>
                {socialLink && (
                  <p className="text-gray-700 flex items-start gap-2">
                    {socialLink.icon}
                    <span className="font-semibold w-32">{socialLink.type}:</span>
                    <a
                      className="text-blue-500 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={socialLink.url}
                    >
                      {video.socialHandle}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileVideo className="text-blue-500" /> Video Information
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-32">Title:</span>
                  <span>{video.title || "Untitled"}</span>
                </p>
                <p className="text-gray-700 flex items-start">
                  <span className="font-semibold w-32">Video URL:</span>
                  <a
                    href={video.videoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all"
                  >
                    {video.videoURL}
                  </a>
                </p>
                <p className="text-gray-700 flex items-start">
                  <span className="font-semibold w-32">Raw Video:</span>
                  <a
                    href={video.rawVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all"
                  >
                    {video.rawVideo}
                  </a>
                </p>
              </div>
            </div>

            {/* Submission Timeline */}
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="text-blue-500" /> Submission Timeline
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-32">Submitted on:</span>
                  <span>{new Date(video.createdAt).toLocaleString()}</span>
                </p>
                {video.updatedAt && video.updatedAt !== video.createdAt && (
                  <p className="text-gray-700 flex items-center">
                    <span className="font-semibold w-32">Last Updated:</span>
                    <span>{new Date(video.updatedAt).toLocaleString()}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Recording Details */}
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="text-blue-500" /> Recording Information
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="font-semibold w-32">Who recorded:</span>
                  <span>{getRecordedByLabel(video.recordedBy)}</span>
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-32">Created by self:</span>
                  {video.recordedVideo ? (
                    <Check className="text-green-500 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-500 w-5 h-5" />
                  )}
                </p>
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="text-blue-500" /> Content Exclusivity
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-40">Shared with other company:</span>
                  <span>{video.submittedElsewhere || "No"}</span>
                </p>
                {video.submittedElsewhere === "Yes" && (
                  <p className="text-gray-700 flex items-center">
                    <span className="font-semibold w-40">Company Name:</span>
                    <span>{video.otherCompanyName || "Not specified"}</span>
                  </p>
                )}
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-40">Already online elsewhere:</span>
                  {video.notUploadedElsewhere ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Check className="w-5 h-5" /> No, content is exclusive
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium flex items-center gap-1">
                      <XCircle className="w-5 h-5" /> Yes, already published elsewhere
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Agreements */}
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Check className="text-blue-500" /> Legal Agreements
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-40">18+ years old:</span>
                  {video.agreed18 ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Check className="w-5 h-5" /> Confirmed
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <XCircle className="w-5 h-5" /> Not confirmed
                    </span>
                  )}
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-40">Terms & Conditions:</span>
                  {video.agreedTerms ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Check className="w-5 h-5" /> Accepted
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <XCircle className="w-5 h-5" /> Not accepted
                    </span>
                  )}
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-40">Exclusive Rights:</span>
                  {video.exclusiveRights ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Check className="w-5 h-5" /> NOT Given to other companies
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium flex items-center gap-1">
                      <XCircle className="w-5 h-5" /> Given to other companies
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Signature */}
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
              <User className="text-blue-500" /> Creator's Signature
            </h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <img 
                src={video.signature} 
                alt="Creator's signature" 
                className="max-w-full h-auto rounded"
              />
            </div>
          </div>

          {/* Employee Details */}
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="text-blue-500" /> Employee Reference
            </h2>
            {video.employee ? (
              <div className="space-y-3">
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-32">Name:</span>
                  <span>{video.employee.name}</span>
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-32">Email:</span>
                  <span className="break-all">{video.employee.email}</span>
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">
                  No employee reference available for this submission.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  This video was submitted without an employee reference.
                </p>
              </div>
            )}
          </div>

          {/* Notification/Admin Email Settings */}
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Mail className="text-blue-500" /> Notification Details
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 flex items-center">
                <span className="font-semibold w-40">Admin Notification:</span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  Email sent to Clipsflickofficial@gmail.com
                </span>
              </p>
              {video.employee && (
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold w-40">Employee Notification:</span>
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    Email sent to {video.employee.name}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetails;
