import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import {Employee} from "../../../models/Submission";

export async function GET() {
  await dbConnect();

  try {
    const employees = await Employee.find();
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Error fetching employees" }, { status: 500 });
  }
}
