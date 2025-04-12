import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import Admin from '../../../../models/Submission'; // Replace with your actual Admin model
import dbConnect from "../../../../lib/dbConnect";


const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret'; // Keep this secret in env

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    admin.formLink = `http://localhost:3000/submit-video/${admin._id}`;
    await admin.save();

    // ✅ Create JWT Token
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // ✅ Set Token in Cookie
    const response = NextResponse.json(
      { message: 'Admin registered', formLink: admin.formLink },
      { status: 201 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Error registering admin' }, { status: 500 });
  }
}
