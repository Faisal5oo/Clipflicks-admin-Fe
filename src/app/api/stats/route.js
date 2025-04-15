// app/api/stats/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { Submission,Employee } from '../../../models/Submission';

export async function GET() {
  try {
    await dbConnect();

    const totalVideos = await Submission.countDocuments();
    const totalEmployees = await Employee.countDocuments();

    return NextResponse.json({
      totalVideos,
      totalEmployees,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
