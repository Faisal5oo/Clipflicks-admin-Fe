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
  FileSignature, Shield, Flag, ShieldCheck
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
    notifications: true,
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
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                      {video.title || "Untitled Video"}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                      <span className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                        <Calendar size={16} className="mr-1 text-blue-400" />
                        {new Date(video.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      
                      <span className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                        <User size={16} className="mr-1 text-blue-400" />
                        {video.firstName} {video.lastName}
                      </span>
                      
                      <span className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                        <Globe size={16} className="mr-1 text-blue-400" />
                        {video.country || "Unknown"}
                      </span>
                      
                      <span className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                        <Wifi size={16} className="mr-1 text-blue-400" />
                        {video.userIp || "Unknown IP"}
                      </span>
                    </div>
                  </div>
                
                  {/* <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-3 py-2 rounded-lg border border-blue-800/50">
                    <span className="text-xs text-blue-400 block mb-1">Submission Time</span>
                    <span className="text-white font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-400" />
                      {new Date(video.createdAt).toLocaleString('en-US', {
                        month: 'numeric', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div> */}
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
                      <h3 className="text-sm font-medium text-gray-300 mb-1">Raw Video URL</h3>
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
                      <h3 className="text-sm font-medium text-gray-300 mb-1">External Video URL</h3>
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
                        Open External Video Link
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700 h-full">
                            <span className="block text-sm text-blue-400 mb-2 font-medium">User's Digital Signature</span>
                            {video.signature ? (
                              <div className="border border-gray-700 rounded-lg p-2 bg-gray-100/90">
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
                          
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700 h-full">
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
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700 h-full">
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
                          
                          <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700 h-full">
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

            {/* Email Notifications Section */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mt-6">
              <button
                onClick={() => toggleSection("notifications")}
                className="w-full flex justify-between items-center p-4 text-left bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Mail size={20} className="mr-2 text-blue-400" />
                  Email Notifications
                </h2>
                {openSections.notifications ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {openSections.notifications && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-gray-700">
                      {/* Admin Notification */}
                      <div className="mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-900/40">
                        <div className="flex items-center mb-2">
                          <ShieldCheck className="w-5 h-5 text-blue-400 mr-2" />
                          <h3 className="text-lg font-medium text-blue-400">Admin Notification</h3>
                        </div>
                        <div className="bg-gray-800/60 rounded-lg p-3 space-y-2">
                          <p className="text-gray-300">
                            <span className="text-blue-400 font-medium">To:</span> Clipsflickofficial@gmail.com
                          </p>
                          <p className="text-gray-300">
                            <span className="text-blue-400 font-medium">Subject:</span> New Video Submission Received – ClipsFlick
                          </p>
                          <p className="text-gray-300">
                            <span className="text-blue-400 font-medium">Sent:</span> {new Date(video.createdAt).toLocaleString()}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-blue-400 font-medium">Content:</span> Notification about new video submission
                            from {video.firstName} {video.lastName} with submission details, video links, and legal agreements.
                          </p>
                          <div className="flex items-center text-blue-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Email sent successfully
                          </div>
                        </div>
                      </div>
                      
                      {/* Employee Notification */}
                      {video.employee?.email ? (
                        <div className="p-3 bg-green-900/20 rounded-lg border border-green-900/40">
                          <div className="flex items-center mb-2">
                            <User className="w-5 h-5 text-green-400 mr-2" />
                            <h3 className="text-lg font-medium text-green-400">Employee Notification</h3>
                          </div>
                          <div className="bg-gray-800/60 rounded-lg p-3">
                            <div className="border-b border-gray-700 pb-2 mb-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">ClipsFlick Notification System</p>
                                    <p className="text-xs text-gray-400">notification@clipsflick.com</p>
                                  </div>
                                </div>
                                <span className="text-xs bg-green-900/60 border border-green-800/60 text-green-400 px-2 py-1 rounded-full">
                                  {new Date(video.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <p className="text-gray-300">
                                <span className="text-green-400 font-medium">To:</span> {video.employee.email}
                              </p>
                              <p className="text-gray-300">
                                <span className="text-green-400 font-medium">Subject:</span> New Video Submission for Review – ClipsFlick
                              </p>
                              
                              <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-700 mt-3">
                                <p className="text-sm text-white mb-3">Hello {video.employee.name},</p>
                                <p className="text-sm text-gray-300 mb-3">
                                  A new video has been submitted to the ClipsFlick platform that requires your attention.
                                </p>
                                
                                <div className="bg-gray-800/80 rounded p-2 border-l-2 border-green-500 mb-3">
                                  <p className="text-sm text-white">Submission Details:</p>
                                  <ul className="text-sm text-gray-300 mt-1 space-y-1">
                                    <li>• Creator: {video.firstName} {video.lastName}</li>
                                    <li>• Country: {video.country || "Unspecified"}</li>
                                    <li>• Submission Date: {new Date(video.createdAt).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}</li>
                                  </ul>
                                </div>
                                
                                <p className="text-sm text-gray-300">
                                  Please log in to your ClipsFlick dashboard to review this submission at your earliest convenience.
                                </p>
                                
                                <div className="mt-4 mb-2 text-center">
                                  <div className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-md font-medium text-sm">
                                    View Full Submission
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-3 border-t border-gray-700 pt-3">
                                <div className="flex items-center text-green-400 text-sm">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Email sent successfully
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(video.createdAt).toLocaleString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700 text-center">
                          <p className="text-gray-400">No employee assigned. No employee notification was sent.</p>
                        </div>
                      )}
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
                          <span className="block text-sm text-blue-400 mb-2 font-medium">Submitted to another company</span>
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
                        
                        {/* <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-700">
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
                        </div> */}
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
