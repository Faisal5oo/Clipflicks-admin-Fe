import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import { Employee } from "../../../../models/Submission";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email } = await req.json();
    const employee = new Employee({ name, email });
    await employee.save();

    const formLink = `https://clipflicks-website.vercel.app/submit-video/${employee._id}`;
    employee.formLink = formLink;
    await employee.save();

    return NextResponse.json({ message: "Employee created", formLink }, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: "Error creating employee" }, { status: 500 });
  }
}
