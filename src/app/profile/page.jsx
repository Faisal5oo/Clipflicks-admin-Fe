"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Layout from "@/components/LayoutWrapper";

const SettingsPage = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // const [currentPassword, setCurrentPassword] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      const parsedAdmin = JSON.parse(storedAdmin);
      setAdmin(parsedAdmin);
    } 
  }, []);

  console.log("admin", admin);

  const handleCopy = () => {
    navigator.clipboard.writeText(admin?.formLink || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // const handleChangePassword = async () => {
  //   if (!currentPassword || !newPassword || !confirmPassword) {
  //     return toast.error("All password fields are required");
  //   }

  //   try {
  //     const res = await axios.put(`/api/admin/${id}/change-password`, {
  //       currentPassword,
  //       newPassword,
  //       confirmPassword,
  //     });

  //     toast.success(res.data.message);  
  //     setCurrentPassword("");
  //     setNewPassword("");
  //     setConfirmPassword("");
  //   } catch (err) {
  //     toast.error(err.response?.data?.error || "Password update failed");
  //   }
  // };


  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Profile
        </h1>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">Email</label>
          <input
            type="email"
            readOnly
            value={admin?.email}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700"
          />
        </div>

        {/* Referral Link */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm mb-1">
            Referral Link
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={admin?.formLink}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <hr className="my-8" />

        {/* Password Change */}
        {/* <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Change Password
        </h2>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Update Password
        </button> */}
      </div>
    </Layout>
  );
};

export default SettingsPage;
