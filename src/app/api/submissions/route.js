import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import { Submission, Employee, Notification } from "../../../models/Submission";
// import Admin from "../../../../models/Submission";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// "https://clipflicks-website.vercel.app"

const allowedOrigin = "*";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function GET() {
  await dbConnect();

  try {
    const submissions = await Submission.find();
    const submissionsWithEmployee = await Promise.all(
      submissions.map(async (submission) => {
        const employee = await Employee.findById(submission.empRef).select(
          "name"
        );
        return {
          id: submission._id,
          employeeName: employee ? employee.name : "Unknown",
          videoURL: submission.videoURL,
          creatorName: `${submission.firstName} ${submission.lastName}`,
          email: submission.email,
        };
      })
    );

    return new NextResponse(JSON.stringify(submissionsWithEmployee), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
      },
    });
  } catch (error) {
    console.error("GET error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const {
      empRef,
      videoURL,
      firstName,
      lastName,
      socialHandle,
      country,
      email,
      recordedVideo,
      rawVideo,
      notUploadedElsewhere,
      agreed18,
      agreedTerms,
      exclusiveRights,
      signature,
    } = await req.json();

    const submission = new Submission({
      empRef,
      videoURL,
      firstName,
      lastName,
      socialHandle,
      country,
      email,
      rawVideo,
      recordedVideo,
      notUploadedElsewhere,
      agreed18,
      agreedTerms,
      exclusiveRights,
      signature,
    });

    await submission.save();

    let employee = null;
    if (empRef) {
      employee = await Employee.findById(empRef);
      if (!employee) {
        return new NextResponse(
          JSON.stringify({ error: "Employee not found" }),
          {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": allowedOrigin,
            },
          }
        );
      }
    }

    // Save signature image

    const uploadsDir = path.join("/tmp", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const signatureBuffer = Buffer.from(signature.split(",")[1], "base64");
    const signatureFilename = `signature_${Date.now()}.png`;
    const signaturePath = path.join(uploadsDir, signatureFilename);
    fs.writeFileSync(signaturePath, signatureBuffer);

    // Setup email
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: "faizanamir103@gmail.com",
    //     pass: "gehr jwig stkl unmd",
    //   },
    // });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Clipsflickofficial@gmail.com",
        pass: "lkwd snbj fmfc ufhy",
      },
    });

    const adminMailOptions = {
      from: "Clipsflickofficial@gmail.com",
      to: "Clipsflickofficial@gmail.com",
      subject: "New Video Submission",
      html: `
        <h3>New Video Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Social Handle:</strong> ${socialHandle}</p>
        <p><strong>Video URL:</strong> <a href="${videoURL}" target="_blank">Watch Video</a></p>
        <p><strong>Raw Video:</strong> <a href="${rawVideo}" target="_blank">Download</a></p>
        <ul>
          <li>✔️ 18+: ${agreed18 ? "Yes" : "No"}</li>
          <li>✔️ Terms Accepted: ${agreedTerms ? "Yes" : "No"}</li>
          <li>✔️ Exclusive Rights NOT Given: ${
            exclusiveRights ? "Yes" : "No"
          }</li>
        </ul>
        <p><strong>Signature:</strong></p>
        <img src="cid:signatureImage" width="200"/>
      `,
      attachments: [
        {
          filename: signatureFilename,
          path: signaturePath,
          cid: "signatureImage",
        },
      ],
    };

    await transporter.sendMail(adminMailOptions);

    if (employee) {
      await transporter.sendMail({
        from: "Clipsflickofficial@gmail.com",
        to: employee.email,
        subject: "New Video Submission Notification",
        html: `<p>Hello ${employee.name},</p>
               <p>You have a new video submission from <strong>${firstName} ${lastName}</strong>.</p>`,
      });
    }

    // Save notification
    await new Notification({
      creatorName: `${firstName} ${lastName}`,
      employeeName: employee ? employee.name : "N/A",
      message: `New video submission from ${firstName} ${lastName}`,
      isRead: false,
    }).save();

    return new NextResponse(
      JSON.stringify({ message: "Submission successful, emails sent" }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
      }
    );
  }
}

// // Get recent submissions
// export async function GET(req) {
//   await dbConnect();

//   try {
//     const recentSubmissions = await Submission.find({})
//       .sort({ createdAt: -1 })
//       .limit(3)
//       .select("firstName lastName createdAt _id");

//     const formatted = recentSubmissions.map((sub) => ({
//       creatorName: `${sub.firstName} ${sub.lastName}`,
//       createdAt: sub.createdAt,
//       id: sub._id,
//     }));

//     return NextResponse.json({ recentSubmissions: formatted }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching recent submissions:", error);
//     return NextResponse.json({ error: "Failed to fetch recent submissions" }, { status: 500 });
//   }
// }

// Get all submissions
// export async function GET(req) {
//   await dbConnect();

//   try {
//     const submissions = await Submission.find();

//     const submissionsWithEmployee = await Promise.all(
//       submissions.map(async (submission) => {
//         const employee = await Employee.findById(submission.empRef).select("name");
//         return {
//           id: submission._id,
//           employeeName: employee ? employee.name : "Unknown",
//           videoURL: submission.videoURL,
//           creatorName: `${submission.firstName} ${submission.lastName}`,
//           email: submission.email,
//         };
//       })
//     );

//     return NextResponse.json(submissionsWithEmployee, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// Get stats (total videos and total employees)
// export async function GET(req) {
//   await dbConnect();

//   try {
//     const totalVideos = await Submission.countDocuments();
//     const totalEmployees = await Employee.countDocuments();

//     return NextResponse.json({ totalVideos, totalEmployees }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching dashboard stats:', error);
//     return NextResponse.json({ message: 'Server error' }, { status: 500 });
//   }
// }

// Get submission by ID
