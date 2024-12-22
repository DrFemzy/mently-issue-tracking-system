import mongoose, { Document, Schema, SchemaTypes, Types } from "mongoose";

export interface IProject extends Document {
  _id: string;
  name: string;
  description: string;
  createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectDoc = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: SchemaTypes.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", ProjectDoc);
export default Project;
