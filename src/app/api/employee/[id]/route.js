import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import { Employee } from "../../../../models/Submission";

// ✅ GET /api/employee/[id] - Fetch Single Employee
export async function GET(_, { params }) {
  await dbConnect();

  try {
    const employee = await Employee.findById(params.id);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Error fetching employee" },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/employee/[id] - Update Employee
export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { name, email } = await req.json();
    const employee = await Employee.findByIdAndUpdate(
      params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee updated successfully", employee },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Error updating employee" },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/employee/[id] - Delete Employee
export async function DELETE(_, { params }) {
  await dbConnect();

  try {
    const employee = await Employee.findByIdAndDelete(params.id);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Error deleting employee" },
      { status: 500 }
    );
  }
}
