import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import Admin from '../../../../models/Submission'; 
import dbConnect from "../../../../lib/dbConnect";

export async function POST(req) {

  try {
    await dbConnect(); 
    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return NextResponse.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        formLink: admin.formLink,
        createdAt: admin.createdAt,
      }
    });
  } catch (error) {
    console.log("Login error", error);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
