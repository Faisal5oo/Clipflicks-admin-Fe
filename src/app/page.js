"use client";
import Layout from "@/components/LayoutWrapper";
import { Users, Video, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { formatDate } from "@/utils/dateFormatter";
import { StatCard } from "@/components/StatCardNew";

const Dashboard = () => {
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [submissionsRes, employeesRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/recent-submissions"),
        axios.get("http://localhost:5000/api/overview"),
        axios.get("http://localhost:5000/api/stats"),
      ]);
      setRecentSubmissions(submissionsRes.data.recentSubmissions);
      setTopEmployees(employeesRes.data);
      setStats(statsRes.data)
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  console.log("stats", stats);

  return (
    <Layout>
      <div className="p-6 text-black">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <StatCard
        icon={<Users size={28} />}
        title="Total Employees"
        value={stats?.totalEmployees || "N/A"}
      />
      <StatCard
        icon={<Video size={28} />}
        title="Total Videos"
        value={stats?.totalVideos || "N/A"}
      />
    </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Submissions */}
          <div className="bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Video Submissions
            </h2>
            <div className="space-y-4">
              {recentSubmissions.length > 0 ? (
                recentSubmissions.map((video) => (
                  <div
                    key={video.id}
                    className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200 border border-gray-100"
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-800">
                        {video.creatorName}
                      </p>
                      <p className="text-sm">{formatDate(video.createdAt)}</p>
                    </div>
                    <Link
                      href={`/videos/${video.id}`}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-purple-200 transition"
                    >
                      View Detail
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent submissions.</p>
              )}
            </div>
          </div>

          {/* Top Employees */}
          <div className="bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
             Top Performing Employees
            </h2>
            <div className="space-y-4">
              {topEmployees.length > 0 ? (
                topEmployees.map((emp, index) => (
                  <div
                    key={emp.empRef}
                    className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200 border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : "👤"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {emp.name}
                        </p>
                        <p className="text-sm text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {emp.totalVideos}{" "}
                      {emp.totalVideos === 1 ? "Video" : "Videos"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No top employees found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};


export default Dashboard;
