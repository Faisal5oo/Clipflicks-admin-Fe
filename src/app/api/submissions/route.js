import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import { Submission, Employee, Notification } from "../../../models/Submission";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://clipflicks-website.vercel.app/",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET() {
  await dbConnect();

  try {
    const submissions = await Submission.find();

    const submissionsWithEmployee = await Promise.all(
      submissions.map(async (submission) => {
        const employee = await Employee.findById(submission.empRef).select("name");
        return {
          id: submission._id,
          employeeName: employee ? employee.name : "Unknown",
          videoURL: submission.videoURL,
          creatorName: `${submission.firstName} ${submission.lastName}`,
          email: submission.email,
        };
      })
    );

    return NextResponse.json(submissionsWithEmployee, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

    let employee;
    if (empRef) {
      employee = await Employee.findById(empRef);
      if (!employee) {
        return new NextResponse(
          JSON.stringify({ error: "Employee not found" }),
          {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          }
        );
      }
    }

    // Save signature image
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const signatureBuffer = Buffer.from(signature.split(",")[1], "base64");
    const signaturePath = path.join(uploadsDir, `signature_${Date.now()}.png`);
    fs.writeFileSync(signaturePath, signatureBuffer);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "faizanamir103@gmail.com",
        pass: "gehr jwig stkl unmd",
      },
    });

    const adminMailOptions = {
      from: "faizanamir103@gmail.com",
      to: "faizanamir103@gmail.com",
      subject: "New Video Submission",
      html: `
        <h3>New Video Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Social Handle:</strong> ${socialHandle}</p>
        <p><strong>Video URL:</strong> <a href="${videoURL}" target="_blank">Watch Video</a></p>
        <p><strong>Raw Video Link:</strong> <a href="${rawVideo}" target="_blank">Download</a></p>
        <h4>Consent & Agreement</h4>
        <ul>
          <li>✔️ 18+: ${agreed18 ? "Yes" : "No"}</li>
          <li>✔️ Terms Accepted: ${agreedTerms ? "Yes" : "No"}</li>
          <li>✔️ Exclusive Rights NOT Given: ${exclusiveRights ? "Yes" : "No"}</li>
        </ul>
        <p><strong>Signature:</strong></p>
        <img src="cid:signatureImage" width="200"/>
      `,
      attachments: [
        {
          filename: "signature.png",
          path: signaturePath,
          cid: "signatureImage",
        },
      ],
    };

    await transporter.sendMail(adminMailOptions);

    if (employee) {
      await transporter.sendMail({
        from: "faizanamir103@gmail.com",
        to: employee.email,
        subject: "New Video Submission Notification",
        html: `<p>Hello ${employee.name},</p>
               <p>You have a new video submission from <strong>${firstName} ${lastName}</strong>.</p>`,
      });
    }

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
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
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

