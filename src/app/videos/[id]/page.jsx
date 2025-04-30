"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Layout from "@/components/LayoutWrapper";
import { 
  Loader2, AlertCircle, Mail, User, Globe, Link as LinkIcon, 
  Calendar, Check, Download, FileVideo, XCircle, Instagram, 
  Youtube, Users, Info, Wifi, Copy, AlertTriangle, Share2, 
  Clock, FileText, Camera, CheckCircle, ChevronDown, ChevronUp, ExternalLink,
  FileSignature, Shield, Flag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import ReactPlayer component with SSR disabled
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), { ssr: false });

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [openSections, setOpenSections] = useState({
    creator: true,
    video: true,
    submission: true,
    recording: true,
    exclusivity: true,
    legal: true,
    signature: true,
  });
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Toggle section visibility
  const toggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    });
  };

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
          <p className="ml-2 text-gray-300">Loading video details...</p>
        </div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen text-red-500">
          <AlertTriangle size={32} />
          <p className="mt-2">{error}</p>
        </div>
      </Layout>
    );

  const socialLink = formatSocialLink(video.socialHandle);

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header with Back button */}
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/videos" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition"
          >
            ← Back to Videos
          </Link>
          
          <div className="text-right">
            <span className="bg-blue-900/40 text-blue-400 px-3 py-1 rounded-full text-sm">
              ID: {video.id}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Video player and basic info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              {/* Video player showing raw video */}
              {video.rawVideo ? (
                <div className="aspect-video">
                  <VideoPlayer 
                    src={video.rawVideo} 
                    poster={video.thumbnailUrl || ""} 
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-400">No raw video available</p>
                </div>
              )}
              
              <div className="p-5">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {video.title || "Untitled Video"}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar size={16} className="mr-1 text-gray-500" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                  
                  <span className="flex items-center">
                    <User size={16} className="mr-1 text-gray-500" />
                    {video.firstName} {video.lastName}
                  </span>
                  
                  <span className="flex items-center">
                    <Globe size={16} className="mr-1 text-gray-500" />
                    {video.country || "Unknown"}
                  </span>
                  
                  <span className="flex items-center">
                    <Wifi size={16} className="mr-1 text-gray-500" />
                    {video.userIp || "Unknown IP"}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {/* Description if available */}
                  {video.description && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-300 mb-1">Description</h3>
                      <p className="text-gray-400 whitespace-pre-line bg-gray-700/50 rounded-lg p-3">
                        {video.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Video URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Raw Video</h3>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={video.rawVideo || "Not available"}
                          readOnly
                          className="w-full px-3 py-1 bg-gray-700 text-gray-300 border border-gray-600 rounded-l-lg text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(video.rawVideo)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-r-lg"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Video URL</h3>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={video.videoURL || "Not available"}
                          readOnly
                          className="w-full px-3 py-1 bg-gray-700 text-gray-300 border border-gray-600 rounded-l-lg text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(video.videoURL)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-r-lg"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {video.rawVideo && (
                      <>
                        <a
                          href={video.rawVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition"
                        >
                          <ExternalLink size={16} className="mr-2" />
                          Open Raw Video
                        </a>
                        
                        <a
                          href={video.rawVideo}
                          download
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center transition"
                        >
                          <Download size={16} className="mr-2" />
                          Download Raw
                        </a>
                      </>
                    )}
                    
                    {video.videoURL && (
                      <a
                        href={video.videoURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center transition"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Open Processed Video
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Signature Section - Added directly below video */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mt-6">
              <button
                onClick={() => toggleSection("signature")}
                className="w-full flex justify-between items-center p-4 text-left bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FileSignature size={20} className="mr-2 text-blue-400" />
                  Signature & Legal Verification
                </h2>
                {openSections.signature ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {openSections.signature && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                            <span className="block text-sm text-blue-400 mb-2 font-medium">User's Digital Signature</span>
                            {video.signature ? (
                              <div className="border border-gray-700 rounded-lg p-2 bg-gray-600/30">
                                <img 
                                  src={video.signature} 
                                  alt="User Signature" 
                                  className="max-h-32 mx-auto"
                                />
                              </div>
                            ) : (
                              <div className="text-red-400 flex items-center">
                                <AlertTriangle size={16} className="mr-1" />
                                No signature provided
                              </div>
                            )}
                          </div>
                          
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                            <span className="block text-sm text-blue-400 mb-2 font-medium">IP Address</span>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-300 bg-gray-700 px-3 py-1 rounded flex items-center">
                                <Wifi className="w-4 h-4 mr-1 text-blue-400" />
                                {video.userIp || "Unknown"}
                                <button 
                                  onClick={() => copyToClipboard(video.userIp)}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4 text-gray-300">
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                            <span className="block text-sm text-blue-400 mb-2 font-medium">Legal Agreements</span>
                            <div className="space-y-2">
                              <div className={`flex items-center ${
                                video.agreed18 ? "text-green-400" : "text-red-400"
                              }`}>
                                {video.agreed18 ? (
                                  <CheckCircle size={16} className="mr-1" />
                                ) : (
                                  <XCircle size={16} className="mr-1" />
                                )}
                                Age Verification (18+)
                              </div>
                              
                              <div className={`flex items-center ${
                                video.agreedTerms ? "text-green-400" : "text-red-400"
                              }`}>
                                {video.agreedTerms ? (
                                  <CheckCircle size={16} className="mr-1" />
                                ) : (
                                  <XCircle size={16} className="mr-1" />
                                )}
                                Terms & Conditions
                              </div>
                              
                              <div className={`flex items-center ${
                                video.exclusiveRights ? "text-green-400" : "text-red-400"
                              }`}>
                                {video.exclusiveRights ? (
                                  <CheckCircle size={16} className="mr-1" />
                                ) : (
                                  <XCircle size={16} className="mr-1" />
                                )}
                                Exclusive Rights Agreement
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                            <span className="block text-sm text-blue-400 mb-2 font-medium">Submission Date</span>
                            <span className="font-medium flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-blue-400" />
                              {new Date(video.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right column - Metadata sections */}
          <div className="space-y-6">
            {/* Creator Information */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection("creator")}
                className="w-full flex justify-between items-center p-4 text-left bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <User size={20} className="mr-2 text-blue-400" />
                  Creator Information
                </h2>
                {openSections.creator ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {openSections.creator && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-gray-700">
                      <div className="space-y-4 text-gray-300">
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Name</span>
                          <span className="font-medium">{video.firstName} {video.lastName}</span>
                        </div>
                        
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Email</span>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{video.email || "No Email"}</span>
                            <a 
                              href={`mailto:${video.email}`} 
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Country</span>
                          <span className="font-medium flex items-center">
                            <Globe className="w-4 h-4 mr-1 text-blue-400" />
                            {video.country || "Not specified"}
                          </span>
                        </div>
                        
                        {socialLink && (
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                            <span className="block text-sm text-blue-400 mb-2 font-medium">Social Media</span>
                            <div className="flex flex-wrap gap-2">
                              <a
                                key={socialLink.type}
                                href={socialLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm"
                              >
                                {socialLink.icon}
                                <span className="ml-1">{socialLink.type}</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recording Details */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection("recording")}
                className="w-full flex justify-between items-center p-4 text-left bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Camera size={20} className="mr-2 text-blue-400" />
                  Recording Details
                </h2>
                {openSections.recording ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {openSections.recording && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-gray-700">
                      <div className="space-y-4 text-gray-300">
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Who recorded</span>
                          <span className="font-medium">{getRecordedByLabel(video.recordedBy)}</span>
                        </div>
                        
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Created by self</span>
                          <span className={`flex items-center ${
                            video.recordedVideo ? "text-green-400" : "text-yellow-400"
                          }`}>
                            {video.recordedVideo ? (
                              <><CheckCircle size={16} className="mr-1" /> Yes</>
                            ) : (
                              <><XCircle size={16} className="mr-1" /> No</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content Exclusivity */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection("exclusivity")}
                className="w-full flex justify-between items-center p-4 text-left bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Shield size={20} className="mr-2 text-blue-400" />
                  Content Exclusivity
                </h2>
                {openSections.exclusivity ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {openSections.exclusivity && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-gray-700">
                      <div className="space-y-4 text-gray-300">
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Submitted elsewhere</span>
                          <span className={`inline-flex items-center ${
                            video.submittedElsewhere === "Yes" ? "text-yellow-400" : "text-green-400"
                          }`}>
                            {video.submittedElsewhere === "Yes" ? (
                              <><Flag size={16} className="mr-1" /> Yes, submitted elsewhere</>
                            ) : (
                              <><CheckCircle size={16} className="mr-1" /> No, exclusive submission</>
                            )}
                          </span>
                        </div>
                        
                        {video.submittedElsewhere === "Yes" && (
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                            <span className="block text-sm text-blue-400 mb-2 font-medium">Company Name</span>
                            <span className="font-medium">{video.otherCompanyName || "Not specified"}</span>
                          </div>
                        )}
                        
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Not uploaded elsewhere</span>
                          <span className={`inline-flex items-center ${
                            video.notUploadedElsewhere ? "text-green-400" : "text-yellow-400"
                          }`}>
                            {video.notUploadedElsewhere ? (
                              <><CheckCircle size={16} className="mr-1" /> Content not uploaded elsewhere</>
                            ) : (
                              <><XCircle size={16} className="mr-1" /> Content may be uploaded elsewhere</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Legal Agreements */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection("legal")}
                className="w-full flex justify-between items-center p-4 text-left bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FileText size={20} className="mr-2 text-blue-400" />
                  Additional Information
                </h2>
                {openSections.legal ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {openSections.legal && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-gray-700">
                      <div className="space-y-4 text-gray-300">
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Associated Employee</span>
                          <span className="font-medium">{video.employee?.name || "Unassigned"}</span>
                        </div>
                        
                        {video.employee?.email && (
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                            <span className="block text-sm text-blue-400 mb-2 font-medium">Employee Email</span>
                            <a 
                              href={`mailto:${video.employee.email}`}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              {video.employee.email}
                            </a>
                          </div>
                        )}
                        
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Last Updated</span>
                          <span className="font-medium">
                            {video.updatedAt ? new Date(video.updatedAt).toLocaleString() : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetails;
