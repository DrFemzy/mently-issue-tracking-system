import mongoose, { Document, Schema, SchemaTypes, Types } from "mongoose";

export interface IIssue extends Document {
  _id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
  priority: "Low" | "Medium" | "High";
  assignedTo: Types.ObjectId | string;
  project: Types.ObjectId | string;
  createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const IssueDoc = new Schema<IIssue>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    assignedTo: { type: SchemaTypes.ObjectId, ref: "User" },
    project: { type: SchemaTypes.ObjectId, ref: "Project" },
    createdBy: { type: SchemaTypes.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Issue = mongoose.model<IIssue>("Issue", IssueDoc);
export default Issue;
