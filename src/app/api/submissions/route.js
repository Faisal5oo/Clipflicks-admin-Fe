import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Admin, { Submission, Employee, Notification } from "../../../models/Submission";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Define allowed origins
const allowedOrigins = [
  "https://clipsflick.com",
  "https://www.clipsflick.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

// OPTIONS method to handle CORS preflight requests
export async function OPTIONS(req) {
  const origin = req.headers.get("Origin");
  if (allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  } else {
    return new NextResponse(null, { status: 403 });
  }
}

// GET method to fetch submissions
export async function GET(req) {
  await dbConnect();

  try {
    const submissions = await Submission.find();
    const submissionsWithReference = await Promise.all(
      submissions.map(async (submission) => {
        let refName = "Unassigned";
        let refEmail = "";
        let isAdmin = false;
        
        if (submission.empRef) {
          // First check if it's an admin reference
          if (submission.admin) {
            const admin = await Admin.findById(submission.empRef);
            if (admin) {
              refName = admin.name || "Admin";
              refEmail = admin.email;
              isAdmin = true;
            }
          } else {
            // Then check if it's an employee reference
            const employee = await Employee.findById(submission.empRef);
            if (employee) {
              refName = employee.name;
              refEmail = employee.email;
            } else {
              // If empRef exists but neither admin nor employee found, double check admin as fallback
              const admin = await Admin.findById(submission.empRef);
              if (admin) {
                refName = admin.name || "Admin";
                refEmail = admin.email;
                isAdmin = true;
              }
            }
          }
        }
        
        return {
          id: submission._id,
          employeeName: refName,
          employeeEmail: refEmail,
          isAdmin,
          videoURL: submission.videoURL,
          creatorName: `${submission.firstName} ${submission.lastName}`,
          email: submission.email,
          createdAt: submission.createdAt,
        };
      })
    );

    return new NextResponse(JSON.stringify(submissionsWithReference), {
      status: 200,
    });
  } catch (error) {
    console.error("GET error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// POST method to handle video submission
export async function POST(req) {
  await dbConnect();

  const origin = req.headers.get("Origin");
  if (allowedOrigins.includes(origin)) {
    try {
      const {
        empRef,
        videoURL,
        title,
        firstName,
        lastName,
        socialHandle,
        country,
        email,
        recordedVideo,
        rawVideo,
        recordedBy,
        submittedElsewhere,
        otherCompanyName,
        notUploadedElsewhere,
        agreed18,
        agreedTerms,
        exclusiveRights,
        signature,
      } = await req.json();

      // Check if empRef is an admin by looking in Admin collection first
      let isAdmin = false;
      let employee = null;
      let refName = "Unassigned";
      
      if (empRef) {
        // First check if empRef exists in Admin collection
        const admin = await Admin.findById(empRef);
        if (admin) {
          isAdmin = true;
          employee = admin;
          refName = admin.name || "Admin";
        } else {
          // If not admin, check if it exists in Employee collection
          employee = await Employee.findById(empRef);
          if (employee) {
            refName = employee.name;
          } else {
            refName = "Unassigned";
          }
        }
      }

      const submission = new Submission({
        empRef,
        admin: isAdmin, // Set admin flag based on whether empRef is an admin
        title,
        videoURL,
        firstName,
        lastName,
        socialHandle,
        country,
        email,
        rawVideo,
        recordedVideo,
        recordedBy,
        submittedElsewhere,
        otherCompanyName,
        notUploadedElsewhere,
        agreed18,
        agreedTerms,
        exclusiveRights,
        signature,
      });

      await submission.save();

      const uploadsDir = path.join("/tmp", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const signatureBuffer = Buffer.from(signature.split(",")[1], "base64");
      const signatureFilename = `signature_${Date.now()}.png`;
      const signaturePath = path.join(uploadsDir, signatureFilename);
      fs.writeFileSync(signaturePath, signatureBuffer);

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
          <p><strong>Video Title:</strong> ${title}</p>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Social Handle:</strong> ${socialHandle}</p>
          <p><strong>Recorded By:</strong> ${recordedBy}</p>
          <p><strong>Submitted to any other company:</strong> ${submittedElsewhere}</p>
          ${
            submittedElsewhere === "Yes"
              ? `<p><strong>Company Name:</strong> ${otherCompanyName}</p>`
              : ""
          }
          <p><strong>Video URL:</strong> <a href="${videoURL}" target="_blank">Watch Video</a></p>
          <p><strong>Raw Video:</strong> <a href="${rawVideo}" target="_blank">Download</a></p>
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

      const notification = await new Notification({
        creatorName: `${firstName} ${lastName}`,
        employeeName: employee ? (isAdmin ? `Admin: ${employee.name}` : employee.name) : "Unassigned",
        isAdmin: isAdmin,
        submissionId: submission._id,
        message: `New video submission from ${firstName} ${lastName}`,
      }).save();

      console.log(`Notification created with submissionId: ${submission._id}`);

      return new NextResponse(
        JSON.stringify({ message: "Submission successful, emails sent" }),
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": origin,
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
            "Access-Control-Allow-Origin": origin,
          },
        }
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ error: "Forbidden" }),
      { status: 403 }
    );
  }
}
