"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { User, Mail, Link as LinkIcon, Key, Eye, EyeOff, Check, RefreshCw, Shield } from "lucide-react";
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-white mb-6">Profile Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <User size={40} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{admin?.name || "Admin"}</h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail size={16} className="mr-1" />
                  <span>{admin?.email || "No email available"}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1 bg-blue-50 text-blue-700 rounded-full px-3 py-1">
                  <Shield size={14} className="inline mr-1" />
                  Administrator
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Referral Link Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <LinkIcon size={20} className="mr-2 text-blue-500" />
                Your Referral Link
              </h3>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={admin?.formLink || "No referral link available"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-20 text-sm text-black placeholder-gray-500"
                />
                <button
                  onClick={handleCopy}
                  disabled={!admin?.formLink}
                  className={`absolute right-1 top-1 px-3 py-1 rounded-md text-sm ${
                    copied 
                      ? "bg-green-500 text-white" 
                      : admin?.formLink 
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center">
                      <Check size={14} className="mr-1" /> Copied
                    </span>
                  ) : (
                    "Copy"
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Share this link with creators to collect video submissions.
              </p>
            </div>

            {/* Password Section - Commented out */}
            {/* 
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Key size={20} className="mr-2 text-blue-500" />
                Password Management
              </h3>
              
              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <Key size={16} className="mr-2" />
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {passwordError && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                      {passwordError}
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center">
                      <Check size={16} className="mr-1" />
                      Password changed successfully!
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-500"
                        placeholder="Enter your current password"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-500"
                        placeholder="Enter your new password"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-500"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff size={16} className="mr-1" /> Hide Password
                        </>
                      ) : (
                        <>
                          <Eye size={16} className="mr-1" /> Show Password
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center flex-1"
                    >
                      {passwordLoading ? (
                        <>
                          <RefreshCw size={16} className="mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordError("");
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
            */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
