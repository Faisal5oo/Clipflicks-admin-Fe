"use client";
import Layout from "@/components/LayoutWrapper";
import { Users, Video, Clock, ChevronRight, Award, Bell, Loader2, Calendar, ArrowUpRight, BarChart, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { formatDate } from "@/utils/dateFormatter";

const Dashboard = () => {
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [submissionsRes, employeesRes, statsRes] = await Promise.all([
        axios.get("/api/recent-submissions"),
        axios.get("/api/top-employees"),
        axios.get("/api/stats"),
      ]);
      setRecentSubmissions(submissionsRes.data.recentSubmissions);
      setTopEmployees(employeesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mt-8">Dashboard Overview</h1>
            <p className="text-gray-400">Welcome to your ClipsFlick admin dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Admin Control Panel
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white/5 backdrop-blur-sm rounded-xl">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-2" />
            <p className="text-gray-300">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-blue-100 text-sm font-medium">Total Employees</h3>
                    <div className="mt-2 text-3xl font-bold">{stats?.totalEmployees || 0}</div>
                    <p className="mt-1 text-blue-200 text-xs">Team members</p>
                  </div>
                  <div className="bg-blue-400/30 p-3 rounded-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-purple-100 text-sm font-medium">Total Videos</h3>
                    <div className="mt-2 text-3xl font-bold">{stats?.totalVideos || 0}</div>
                    <p className="mt-1 text-purple-200 text-xs">Submissions collected</p>
                  </div>
                  <div className="bg-purple-400/30 p-3 rounded-lg">
                    <Video className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-green-100 text-sm font-medium">Top Performer</h3>
                    <div className="mt-2 text-xl font-bold truncate">
                      {topEmployees?.length > 0 ? topEmployees[0].name : "N/A"}
                    </div>
                    <p className="mt-1 text-green-200 text-xs">{topEmployees?.length > 0 ? `${topEmployees[0].totalVideos} videos` : "No data"}</p>
                  </div>
                  <div className="bg-green-400/30 p-3 rounded-lg">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-amber-100 text-sm font-medium">Latest Activity</h3>
                    <div className="mt-2 text-xl font-bold">
                      {recentSubmissions?.length > 0 
                        ? formatDate(recentSubmissions[0].createdAt).split(',')[0] 
                        : "No activity"}
                    </div>
                    <p className="mt-1 text-amber-200 text-xs">Last submission date</p>
                  </div>
                  <div className="bg-amber-400/30 p-3 rounded-lg">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Submissions */}
              <div className="bg-white/5 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-gray-800">
                <div className="border-b border-gray-700 p-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Video className="h-5 w-5 mr-2 text-blue-400" />
                    Recent Video Submissions
                  </h2>
                  <Link 
                    href="/videos" 
                    className="text-blue-400 text-sm hover:text-blue-300 flex items-center transition-colors"
                  >
                    View all <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                
                <div className="divide-y divide-gray-800">
                  {recentSubmissions.length > 0 ? (
                    recentSubmissions.map((video) => (
                      <div
                        key={video.id}
                        className="p-5 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-900/50 text-purple-400 rounded-full flex items-center justify-center mr-4">
                              <Video className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {video.creatorName}
                              </p>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                                <p className="text-xs text-gray-400">{formatDate(video.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                          <Link
                            href={`/videos/${video.id}`}
                            className="bg-blue-900/50 hover:bg-blue-800 text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                          >
                            View <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-gray-400">
                      <Video className="h-10 w-10 mx-auto mb-3 text-gray-500" />
                      <p>No recent submissions</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Employees */}
              <div className="bg-white/5 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-gray-800">
                <div className="border-b border-gray-700 p-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-green-400" />
                    Top Performing Employees
                  </h2>
                  <Link 
                    href="/users" 
                    className="text-green-400 text-sm hover:text-green-300 flex items-center transition-colors"
                  >
                    View all <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                
                <div className="divide-y divide-gray-800">
                  {topEmployees.length > 0 ? (
                    topEmployees.map((emp, index) => (
                      <div
                        key={emp.empRef}
                        className="p-5 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 relative">
                              {index === 0 ? (
                                <div className="bg-amber-900/50 w-12 h-12 rounded-full flex items-center justify-center text-amber-300">
                                  <span className="text-xl">🥇</span>
                                </div>
                              ) : index === 1 ? (
                                <div className="bg-gray-600/50 w-12 h-12 rounded-full flex items-center justify-center text-gray-300">
                                  <span className="text-xl">🥈</span>
                                </div>
                              ) : index === 2 ? (
                                <div className="bg-amber-800/50 w-12 h-12 rounded-full flex items-center justify-center text-amber-600">
                                  <span className="text-xl">🥉</span>
                                </div>
                              ) : (
                                <div className="bg-blue-900/50 w-12 h-12 rounded-full flex items-center justify-center text-blue-400">
                                  <Users className="h-5 w-5" />
                                </div>
                              )}
                              <div className={`absolute -top-1 -right-1 rounded-full ${index < 3 ? "bg-gradient-to-r from-amber-500 to-yellow-300" : "bg-blue-500"} w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-900`}>
                                #{index + 1}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-white">{emp.name}</p>
                              <p className="text-xs text-gray-400">{emp.email}</p>
                            </div>
                          </div>
                          <div className="bg-green-900/30 text-green-400 px-4 py-2 rounded-lg text-sm font-medium">
                            {emp.totalVideos}{" "}
                            {emp.totalVideos === 1 ? "Video" : "Videos"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-gray-400">
                      <Users className="h-10 w-10 mx-auto mb-3 text-gray-500" />
                      <p>No top employees found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

