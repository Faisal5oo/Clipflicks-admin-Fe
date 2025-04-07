"use client";
import { Clipboard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Layout from "../../../components/LayoutWrapper";

const API_URL = "http://localhost:5000/api/users"; // Replace with actual API
const TOKEN = "your_token_here"; // Replace with your actual token

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  console.log("employees",employee)
  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        setEmployee(response.data);
      } catch (err) {
        setError("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  // const referralLink = employee?.formLink
  //   ? `https://example.com/register?ref=${employee.id}`
  //   : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(employee.formLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        {/* Back Button */}
        <Link href="/users">
          <button className="flex items-center text-blue-500 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Employees
          </button>
        </Link>

        {/* Employee Details */}
        <h1 className="text-3xl font-bold text-gray-800">{employee.name}</h1>
        <p className="text-gray-600">{employee.role}</p>
        <p className="text-gray-600">{employee.email}</p>
        <p className="text-gray-500 mt-2">
          Joined on: {new Date(employee.createdAt).toLocaleDateString()}
        </p>

        {/* Referral Link */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center justify-between text-black">
          <p className="text-gray-700 font-medium">Referral Link:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={employee?.formLink}
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
        {copied && <p className="text-green-500 mt-2">Referral link copied!</p>}
      </div>
    </Layout>
  );
};

export default EmployeeDetail;
