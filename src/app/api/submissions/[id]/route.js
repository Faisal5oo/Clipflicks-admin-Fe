import dbConnect from "../../../../lib/dbConnect"; // Update path if necessary
import { Submission, Employee } from "../../../../models/Submission";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const submission = await Submission.findById(id);

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const employee = submission.empRef
      ? await Employee.findById(submission.empRef)
      : null;

    const videoDetails = {
      id: submission._id,
      title: submission.title || "Untitled Video",
      videoURL: submission.videoURL,
      firstName: submission.firstName,
      lastName: submission.lastName,
      creatorName: `${submission.firstName} ${submission.lastName}`,
      email: submission.email,
      socialHandle: submission.socialHandle,
      country: submission.country,
      rawVideo: submission.rawVideo,
      recordedVideo: submission.recordedVideo,
      recordedBy: submission.recordedBy,
      submittedElsewhere: submission.submittedElsewhere,
      otherCompanyName: submission.otherCompanyName,
      notUploadedElsewhere: submission.notUploadedElsewhere,
      agreed18: submission.agreed18,
      agreedTerms: submission.agreedTerms,
      exclusiveRights: submission.exclusiveRights,
      employee: employee
        ? { name: employee.name, email: employee.email }
        : null,
      signature: submission.signature,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    };

    return NextResponse.json(videoDetails, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params; // ✅ Get the id from route params

    const deletedSubmission = await Submission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Submission deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
