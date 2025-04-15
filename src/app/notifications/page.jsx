"use client";
import Layout from "@/components/LayoutWrapper";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "@/utils/dateFormatter";


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; // Show 10 notifications per page

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications using Axios
  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/api/notifications");
      setNotifications(data); // Store all notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Pagination logic
  const indexOfLastNotification = currentPage * perPage;
  const indexOfFirstNotification = indexOfLastNotification - perPage;
  const currentNotifications = notifications?.slice(indexOfFirstNotification, indexOfLastNotification);
  const totalPages = Math.ceil(notifications?.length / perPage);

  return (
    <Layout>
      <div className="mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-black">Notifications</h2>
        </div>

        {notifications?.length === 0 ? (
          <p className="text-gray-500 text-center">No new notifications</p>
        ) : (
          <div>
            <ul>
              {currentNotifications?.map((notification) => (
                <li key={notification.id} className="border-b py-4 text-black">
                  <p className="font-semibold">{notification.message}</p>
                  <p className="text-sm">{formatDate(notification.createdAt)}</p>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
