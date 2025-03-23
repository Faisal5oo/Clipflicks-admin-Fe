import Layout from "@/components/LayoutWrapper";
import { LayoutDashboard, Users, Video, Clock } from "lucide-react";

const Dashboard = () => {
  const videos = [
    { id: 1, title: "Promo Ad", creator: "John Doe", date: "Mar 2, 2025" },
    { id: 2, title: "Tutorial Video", creator: "Jane Smith", date: "Mar 3, 2025" },
    { id: 3, title: "Product Review", creator: "Mike Johnson", date: "Mar 4, 2025" },
  ];

  const employees = [
    { id: 1, name: "John Doe", role: "Editor" },
    { id: 2, name: "Jane Smith", role: "Content Creator" },
    { id: 3, name: "Mike Johnson", role: "Reviewer" },
  ];

  return (
    <Layout>
      <div className="p-6">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Employees</h2>
              <p className="text-2xl font-bold">25</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <Video size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Total Videos</h2>
              <p className="text-2xl font-bold">120</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <Clock size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Pending Approvals</h2>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>

        {/* Recent Submissions & Employees */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Video Submissions</h2>
            <ul>
              {videos.map((video) => (
                <li key={video.id} className="flex justify-between py-2 border-b last:border-none">
                  <span className="font-medium">{video.title}</span>
                  <span className="text-gray-500">{video.creator}</span>
                  <span className="text-gray-400">{video.date}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Employee Overview</h2>
            <ul>
              {employees.map((emp) => (
                <li key={emp.id} className="flex justify-between py-2 border-b last:border-none">
                  <span className="font-medium">{emp.name}</span>
                  <span className="text-gray-500">{emp.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
