// app/api/top-employees/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Admin, { Submission, Employee } from '../../../models/Submission';

export async function GET() {
  try {
    await dbConnect();

    // Count total references per empRef regardless of admin flag
    const topEmpRefs = await Submission.aggregate([
      { $match: { empRef: { $exists: true, $ne: null } } }, // Only count those with empRef
      { $group: { _id: "$empRef", totalVideos: { $sum: 1 } } },
      { $sort: { totalVideos: -1 } },
      { $limit: 5 }, // Get top 5 instead of 3 to allow for filtering out admins
    ]);

    const detailedEmployees = await Promise.all(
      topEmpRefs.map(async (emp) => {
        // First check if it's an employee
        const employee = await Employee.findById(emp._id);
        if (employee) {
          return {
            empRef: emp._id,
            name: employee.name,
            email: employee.email,
            formLink: employee.formLink,
            totalVideos: emp.totalVideos,
            isAdmin: false
          };
        }
        
        // If not an employee, it might be an admin (we'll exclude these from the top performers)
        const admin = await Admin.findById(emp._id);
        if (admin) {
          return null; // Return null for admins - they'll be filtered out
        }

        return null; // If neither found, filter out
      })
    );

    // Filter out null values (admins) and take the top 3
    const filtered = detailedEmployees.filter(Boolean).slice(0, 3);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error in top employees API:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
