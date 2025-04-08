import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import { Submission, Employee, Notification } from "../../../models/Submission";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

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
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 400 }
        );
      }
    }

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
          <li>✔️ Exclusive Rights NOT Given: ${
            exclusiveRights ? "Yes" : "No"
          }</li>
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
      const employeeMailOptions = {
        from: process.env.EMAIL_USER,
        to: employee.email,
        subject: "New Video Submission Notification",
        html: `
          <p>Hello ${employee.name},</p>
          <p>You have a new video submission from <strong>${firstName} ${lastName}</strong>.</p>
        `,
      };
      await transporter.sendMail(employeeMailOptions);
    }

    const newNotification = new Notification({
      creatorName: `${firstName} ${lastName}`,
      employeeName: employee ? employee.name : "N/A",
      message: `New video submission from ${firstName} ${lastName}`,
      isRead: false,
    });

    await newNotification.save();

    return NextResponse.json({ message: "Submission successful" });
  } catch (error) {
    console.error("Error submitting video:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
