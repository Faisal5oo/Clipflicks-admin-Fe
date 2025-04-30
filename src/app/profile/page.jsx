"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { User, Mail, Link as LinkIcon, Key, Eye, EyeOff, Check, RefreshCw, Shield, Settings, AlertCircle, Copy, Loader2 } from "lucide-react";
import Layout from "@/components/LayoutWrapper";

const SettingsPage = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get admin data from local storage
    try {
      const adminData = localStorage.getItem("admin");
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
    } catch (error) {
      console.error("Error parsing admin data:", error);
    }
    setLoading(false);
  }, []);

  const handleCopy = () => {
    if (!admin?.formLink) return;
    
    navigator.clipboard.writeText(admin.formLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      // Make sure to use the correct HTTP method and endpoint based on your API
      // Console log to verify the data being sent
      console.log("Sending password change request:", {
        currentPassword,
        newPassword,
        adminId: admin?._id
      });
      
      const response = await axios.put("/api/admin/change-password", {
        currentPassword,
        newPassword,
        adminId: admin?._id
      });
      
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setPasswordSuccess(false);
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }
    
    setChangingPassword(true);
    
    try {
      // Make sure to use the correct HTTP method and endpoint based on your API
      // Console log to verify the data being sent
      console.log("Sending password change request:", {
        currentPassword,
        newPassword,
        adminId: admin?._id
      });
      
      const response = await axios.put("/api/admin/change-password", {
        currentPassword,
        newPassword,
        adminId: admin?._id
      });
      
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess(false);
        setChangingPassword(false);
      }, 3000);
    } catch (error) {
      console.error("Password change error:", error);
      setError(error.response?.data?.message || "Failed to change password. Please try again.");
      setPasswordError(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setPasswordLoading(false);
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-10">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <Settings size={24} className="text-blue-400" /> Settings
          </h1>

          {loading ? (
            <div className="flex items-center justify-center h-60">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-60 text-red-400">
              <AlertCircle className="w-6 h-6 mr-2" /> {error}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold text-blue-400 border-b border-gray-700 pb-2">
                    Profile Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <div className="flex">
                        <input
                          type="email"
                          value={admin?.email || ""}
                          disabled
                          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        First Name
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={admin?.name?.split(" ")[0] || ""}
                          disabled
                          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Last Name
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={admin?.name?.split(" ")[1] || ""}
                          disabled
                          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h2 className="text-xl font-semibold text-blue-400 border-b border-gray-700 pb-2">
                    Referral Link
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Your Referral URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={admin?.referralLink || "No referral link available"}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm"
                      />
                      <button
                        onClick={handleCopy}
                        className="ml-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                      >
                        {copied ? (
                          <Check size={20} />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Share this link with others. When they join, they'll be connected to your account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="mt-8 border-t border-gray-700 pt-6">
                <h2 className="text-xl font-semibold text-blue-400 mb-4">
                  Change Password
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex justify-center items-center"
                      >
                        {changingPassword ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : null}
                        {changingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Password Requirements</h3>
                    <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                      <li>At least 8 characters long</li>
                      <li>Include at least one uppercase letter</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                    
                    <div className="mt-4 p-3 bg-gray-900/50 rounded border border-gray-700">
                      <p className="text-sm text-gray-300">
                        <span className="text-yellow-400 font-bold flex items-center gap-1">
                          <AlertCircle size={16} />Note:
                        </span>{" "}
                        After changing your password, you'll need to log in again with your new credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
