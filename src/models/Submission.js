import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema(
    {
      empRef: String,
      title: String,
      videoURL: String,
      firstName: String,                                         
      lastName: String,
      socialHandle: String,
      country: String,
      email: String,
      rawVideo : String,
      recordedVideo: Boolean,
      notUploadedElsewhere: Boolean,
      agreed18: Boolean,
      agreedTerms: Boolean,
      exclusiveRights: Boolean,
      signature: String,
    },
    { timestamps: true } 
  );
  
  // Admin Schema
  const adminSchema = new mongoose.Schema(
    {
      email: { type: String, required: true },
      password: { type: String, required: true },
      formLink: { type: String },
      role: { type: String, required: true, default: "admin" },
    },
    { timestamps: true }
  );
  
  // Employee Schema
  const employeeSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      formLink: { type: String },
    },
    { timestamps: true }
  );
  
  const notificationSchema = new mongoose.Schema(
    {
      creatorName: { type: String, required: true },
      employeeName: String,
      message: { type: String, required: true },
      isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  
  
export const Submission = mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
  
export default Admin; 