import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { Notification } from '../../../models/Submission';

export async function GET() {
  await dbConnect();

  try {
    // Fetch notifications with populated submissionId
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .lean(); // Use lean() to get plain JavaScript objects
    
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
