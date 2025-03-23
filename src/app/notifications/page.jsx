"use client"
import Layout from "@/components/LayoutWrapper";
import { useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "A new video was submitted by John Doe",
      title: "React Tutorial",
      creator: "Alice Smith",
      email: "alice@example.com",
      timestamp: "March 4, 2025, 10:30 AM",
    },
    {
      id: 2,
      message: "A new video was submitted by Sarah Khan",
      title: "Next.js Guide",
      creator: "Bob Johnson",
      email: "bob@example.com",
      timestamp: "March 4, 2025, 11:15 AM",
    },
  ]);

  // Function to remove a single notification
  const removeNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  // Function to clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Simulate a new notification (can be triggered on form submit)
  const addNotification = () => {
    const newNotification = {
      id: Date.now(),
      message: "A new video was submitted by Alex Brown",
      title: "JavaScript Tips",
      creator: "Chris Evans",
      email: "chris@example.com",
      timestamp: new Date().toLocaleString(),
    };
    setNotifications([newNotification, ...notifications]); // Add new notification at the top
  };

  return (
    <Layout>
    <div className="mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Notifications</h2>
        {/* <button 
          onClick={addNotification} 
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Simulate Notification
        </button> */}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No new notifications</p>
      ) : (
        <div>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="border-b py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{notification.message}</p>
                  <p>
                    <strong>Title:</strong> {notification.title}
                  </p>
                  <p>
                    <strong>Creator:</strong> {notification.creator} ({notification.email})
                  </p>
                  <p className="text-gray-500 text-sm">{notification.timestamp}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Mark as Read
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={clearNotifications}
            className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear All
          </button>
        </div>
      )}
    </div></Layout>
  );
};

export default Notifications;
