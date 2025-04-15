// app/api/top-employees/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { Submission, Employee } from '../../../models/Submission';

export async function GET() {
  try {
    await dbConnect();

    const topEmpRefs = await Submission.aggregate([
      { $group: { _id: "$empRef", totalVideos: { $sum: 1 } } },
      { $sort: { totalVideos: -1 } },
      { $limit: 3 },
    ]);

    const detailedEmployees = await Promise.all(
      topEmpRefs.map(async (emp) => {
        const employee = await Employee.findById(emp._id);
        if (!employee) return null;

        return {
          empRef: emp._id,
          name: employee.name,
          email: employee.email,
          formLink: employee.formLink,
          totalVideos: emp.totalVideos,
        };
      })
    );

    const filtered = detailedEmployees.filter(Boolean);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error in top employees API:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
