// app/api/recent-submissions/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { Submission } from '../../../models/Submission';

export async function GET() {
  try {
    await dbConnect();

    const recentSubmissions = await Submission.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select('firstName lastName createdAt _id');

    const formatted = recentSubmissions.map((sub) => ({
      creatorName: `${sub.firstName} ${sub.lastName}`,
      createdAt: sub.createdAt,
      id: sub._id,
    }));

    return NextResponse.json({ recentSubmissions: formatted });
  } catch (error) {
    console.error('Error fetching recent submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent submissions' },
      { status: 500 }
    );
  }
}
