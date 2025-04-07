"use client";
import { Clipboard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "@/components/LayoutWrapper";

const AdminSettings = () => {
  const [admin, setAdmin] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Retrieve the admin data from localStorage
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (storedAdmin) {
      setAdmin(storedAdmin);
    }
  }, []);

  const copyToClipboard = () => {
    if (admin?.referralCode) {
      navigator.clipboard.writeText(admin.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!admin) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        {/* Back Button */}
        <Link href="/dashboard">
          <button className="flex items-center text-blue-500 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </Link>

        {/* Admin Details */}
        <h1 className="text-3xl font-bold text-gray-800">{admin.name}</h1>
        <p className="text-gray-600">{admin.email}</p>

        {/* Referral Code */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
          <p className="text-gray-700 font-medium">Referral Code:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={admin?.referralCode || ''}
              className="bg-white px-3 py-1 border rounded-lg w-64 truncate"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              <Clipboard size={20} />
            </button>
          </div>
        </div>
        {copied && <p className="text-green-500 mt-2">Referral code copied!</p>}
      </div>
    </Layout>
  );
};

export default AdminSettings;
