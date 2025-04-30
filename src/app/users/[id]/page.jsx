"use client";
import { Clipboard, ArrowLeft, Mail, Calendar, Link as LinkIcon, Video, User, Users, Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Layout from "../../../components/LayoutWrapper";
import { toast } from "react-hot-toast";

const API_URL = "/api/employee"; // Replace with actual API
const TOKEN = "your_token_here"; // Replace with your actual token

const EmployeeDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [employeeVideos, setEmployeeVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (!id) return;

    const fetchEmployeeDetails = async () => {
      try {
        // Fetch employee details
        const employeeResponse = await axios.get(`/api/employee/${id}`);
        setEmployee(employeeResponse.data);
        
        // Then fetch videos
        try {
          const videosResponse = await axios.get(`/api/employee/${id}/videos`);
          setEmployeeVideos(videosResponse.data || []);
        } catch (videoErr) {
          console.error("Error fetching employee videos:", videoErr);
          // Don't set full error here, just continue with empty videos
          setEmployeeVideos([]);
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const copyToClipboard = () => {
    if (!employee?.formLink) return;
    
    navigator.clipboard.writeText(employee.formLink);
    toast.success("Referral link copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </Layout>
  );
  
  if (error) return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-gray-800 text-red-400 rounded-xl mt-10 text-center border border-gray-700">
        <h2 className="text-xl font-bold">{error}</h2>
        <button 
          onClick={() => router.push('/users')}
          className="mt-4 px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-800/50"
        >
          Return to Employees
        </button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/users">
            <button className="flex items-center text-blue-400 hover:text-blue-300 transition">
              <ArrowLeft size={20} className="mr-2" />
              Back to Employees
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Details Card */}
          <div className="md:col-span-1">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-blue-900/40 rounded-full flex items-center justify-center text-blue-400 mx-auto mb-4">
                  <User size={40} />
                </div>
                <h1 className="text-2xl font-bold text-white">{employee.name}</h1>
                <p className="text-gray-300 flex items-center justify-center mt-1">
                  <Mail size={16} className="mr-1 text-blue-400" />
                  {employee.email}
                </p>
                <div className="flex items-center justify-center mt-1 text-gray-400">
                  <Calendar size={16} className="mr-1 text-blue-400" />
                  <span className="text-sm">
                    Joined {new Date(employee.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="text-md font-semibold text-blue-400 mb-2">Videos Stats</h3>
                <div className="bg-gray-700/50 text-blue-300 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Video className="mr-2 text-blue-400" size={18} />
                    <span>Total Videos</span>
                  </div>
                  <span className="font-bold">{employeeVideos.length}</span>
                </div>
              </div>
            </div>

            {/* Referral Link Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mt-4">
              <h3 className="text-md font-semibold text-blue-400 mb-3 flex items-center">
                <LinkIcon size={18} className="mr-2" />
                Referral Link
              </h3>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={employee?.formLink || ""}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-20 text-sm truncate text-white focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className={`absolute right-1 top-1 px-3 py-1 rounded-md text-sm ${
                    copied 
                      ? "bg-green-600 text-white" 
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center">
                      <Check className="w-4 h-4 mr-1" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </span>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Share this link with your creators to collect their video submissions.
              </p>
            </div>
          </div>

          {/* Videos Section */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Video size={20} className="mr-2 text-blue-400" />
                  Recent Submissions
                </h2>
                <span className="px-3 py-1 text-sm bg-blue-900/40 text-blue-400 rounded-full font-medium">
                  {employeeVideos.length} Videos
                </span>
              </div>

              {employeeVideos.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {employeeVideos.map((video) => (
                    <div key={video.id} className="py-4 hover:bg-gray-700/50 transition-colors rounded-lg px-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <Users size={16} className="text-blue-400 mr-2" />
                            <p className="font-medium text-white">{video.creatorName}</p>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{video.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(video.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex">
                          <Link href={`/videos/${video.id}`}>
                            <button className="px-3 py-1 bg-blue-900/40 text-blue-400 rounded-full text-sm font-medium hover:bg-blue-800/50 flex items-center">
                              <ExternalLink size={14} className="mr-1" /> View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <Video size={40} className="mx-auto mb-2 text-gray-600" />
                  <p>No videos submitted yet</p>
                  <p className="text-sm mt-1">Share the referral link to collect video submissions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetail;
