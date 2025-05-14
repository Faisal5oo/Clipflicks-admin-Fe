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
          description: submission.description,
          creatorName: `${submission.firstName} ${submission.lastName}`,
          email: submission.email,
          createdAt: submission.createdAt,
          userIp: submission.userIp || "Unknown",
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

  // Get IP address from request headers, Vercel provides x-forwarded-for header
  const forwardedFor = req.headers.get('x-forwarded-for');
  const userIp = forwardedFor ? forwardedFor.split(',')[0] : 'Unknown';

  console.log("User IP address:", userIp);

  const origin = req.headers.get("Origin");
  if (allowedOrigins.includes(origin)) {
    try {
      const {
        empRef,
        videoURL,
        title,
        description,
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
        description,
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
        userIp, // Store user IP address
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
        subject: "New Video Submission Received – ClipsFlick",
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 32px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #712f8e; padding-bottom: 16px; margin-bottom: 32px;">
        <h2 style="color: #712f8e; margin: 0;">ClipsFlick Submission Notification</h2>
        <p style="font-size: 14px; color: #666; margin-top: 4px;">A new video has been submitted through the official ClipsFlick platform.</p>
      </div>

      <h3 style="color: #712f8e; margin-bottom: 12px;">Submission Details</h3>
      <p style="margin: 6px 0;"><strong>Video Title:</strong> ${title}</p>
        <p style="margin: 6px 0;"><strong>Description:</strong></p>
        <p style="margin: 6px 0; white-space: pre-wrap; line-height: 1.6;">${description}</p>
      <p style="margin: 6px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p style="margin: 6px 0;"><strong>Email:</strong>  <a href="mailto:${email}" style="color: #712f8e; text-decoration: none;">${email}</a></p>
      <p style="margin: 6px 0;"><strong>Country:</strong> ${country}</p>
      <p style="margin: 6px 0;"><strong>Social Handle:</strong> ${socialHandle}</p>
      <p style="margin: 6px 0;"><strong>IP Address:</strong> ${userIp}</p>
      <p style="margin: 6px 0;"><strong>Who is recorded this video?</strong></p>
      <p style="margin: 6px 0;">${recordedBy}</p>
      <p style="margin: 20px 0 8px;"><strong>Did you submit this video to another company?</strong> 
        ${submittedElsewhere === "Yes" ? "Yes" : "No"}
      </p>
      ${submittedElsewhere === "Yes"
        ? `<p style="margin: 6px 0;"><strong>Other Company Name:</strong> ${otherCompanyName}</p>`
        : ""
      }

      <h3 style="color: #712f8e; margin: 6px 0">🔗 Video Links
</h3>
      <p style="margin: 6px 0;"><strong>Watch Video:</strong> <a href="${videoURL}" target="_blank" style="color: #712f8e;">Click Here</a></p>
      <p style="margin: 6px 0;"><strong>Download Raw Footage:</strong> <a href="${rawVideo}" target="_blank" style="color: #712f8e;">Download</a></p>

      <h3 style="color: #712f8e; margin: 32px 0 16px;">✅ Submission Confirmation</h3>
      <ul style="list-style: none; padding-left: 0; margin: 0;">
        <li style="margin: 6px 0;">
          I verify that I am at least 18 years old:<br />
          <strong>${agreed18 ? "Yes ✅" : "No ❌"}</strong>
        </li>
        <li style="margin: 6px 0;">
          I consent to the Terms of Submission and Privacy Agreement:<br />
          <strong>${agreedTerms ? "Yes, I agree ✅" : "No, I do not agree ❌"}</strong>
        </li>
        <li style="margin: 6px 0;">
          I have not given exclusive rights to this video:<br />
          <strong>${exclusiveRights ? "Yes ✅" : "No ❌"}</strong>
        </li>
      </ul>

      <h3 style="color: #712f8e; margin: 32px 0 16px;">User Signature</h3>
      <img src="cid:signatureImage" width="240" style="border: 1px solid #ccc; border-radius: 6px; margin-top: 10px;" />

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

      <footer style="font-size: 12px; color: #999; line-height: 1.5;">
        This email was sent by <span style="color: #712f8e;"><strong>ClipsFlick</strong></span>, the premium platform for user-generated viral content.
        <br />
        <em>Internal Use Only – Handle Submission Data Confidentially.</em>
      </footer>
    </div>
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
        message: `New video submission from ${firstName} ${lastName} (IP: ${userIp})`,
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
