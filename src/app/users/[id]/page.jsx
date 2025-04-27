"use client";
import { Clipboard, ArrowLeft, Mail, Calendar, Link as LinkIcon, Video, User, Users } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Layout from "../../../components/LayoutWrapper";

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
    navigator.clipboard.writeText(employee.formLink);
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
      <div className="max-w-3xl mx-auto p-6 bg-red-50 text-red-500 rounded-xl mt-10 text-center">
        <h2 className="text-xl font-bold">{error}</h2>
        <button 
          onClick={() => router.push('/users')}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Return to Employees
        </button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/users">
            <button className="flex items-center text-blue-600 hover:text-blue-800 hover:underline">
              <ArrowLeft size={20} className="mr-2" />
              Back to Employees
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Details Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <User size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
                <p className="text-gray-600 flex items-center justify-center mt-1">
                  <Mail size={16} className="mr-1" />
                  {employee.email}
                </p>
                <div className="flex items-center justify-center mt-1 text-gray-500">
                  <Calendar size={16} className="mr-1" />
                  <span className="text-sm">
                    Joined {new Date(employee.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Videos Stats</h3>
                <div className="bg-blue-50 text-blue-700 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Video className="mr-2" size={18} />
                    <span>Total Videos</span>
                  </div>
                  <span className="font-bold">{employeeVideos.length}</span>
                </div>
              </div>
            </div>

            {/* Referral Link Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-4">
              <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                <LinkIcon size={18} className="mr-2 text-blue-500" />
                Referral Link
              </h3>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={employee?.formLink || ""}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-20 text-sm truncate text-black"
                />
                <button
                  onClick={copyToClipboard}
                  className={`absolute right-1 top-1 px-3 py-1 rounded-md text-sm ${
                    copied ? "bg-green-500 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Share this link with your creators to collect their video submissions.
              </p>
            </div>
          </div>

          {/* Videos Section */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Video size={20} className="mr-2 text-blue-500" />
                  Recent Submissions
                </h2>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  {employeeVideos.length} Videos
                </span>
              </div>

              {employeeVideos.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {employeeVideos.map((video) => (
                    <div key={video.id} className="py-4 hover:bg-gray-50 transition-colors rounded-lg px-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <Users size={16} className="text-gray-400 mr-2" />
                            <p className="font-medium text-gray-800">{video.creatorName}</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{video.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(video.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex">
                          <Link href={`/videos/${video.id}`}>
                            <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Video size={40} className="mx-auto mb-2 text-gray-300" />
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
