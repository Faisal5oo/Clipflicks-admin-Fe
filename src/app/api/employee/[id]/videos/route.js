import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import { Submission, Employee } from "../../../../../models/Submission";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    
    // Verify if employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Find all submissions where the empRef is the employee's id and admin flag is false
    // This ensures we only get submissions specifically made through employee's referral link
    const submissions = await Submission.find({ empRef: id, admin: false });
    
    console.log(`Found ${submissions.length} employee submissions for employee ID: ${id}`);

    // Format the response
    const formattedSubmissions = await Promise.all(
      submissions.map(async (submission) => {
        return {
          id: submission._id,
          employeeId: id,
          employeeName: employee.name,
          videoURL: submission.videoURL,
          title: submission.title || "",
          creatorName: `${submission.firstName} ${submission.lastName}`,
          email: submission.email,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt,
        };
      })
    );

    return NextResponse.json(formattedSubmissions, { status: 200 });
  } catch (error) {
    console.error("GET employee videos error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
} 