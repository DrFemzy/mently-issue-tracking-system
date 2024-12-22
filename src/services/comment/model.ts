import mongoose, { Document, Schema, SchemaTypes, Types } from "mongoose";

export interface IComment extends Document {
  _id: string;
  comment: string;
  issue: Types.ObjectId | string;
  user: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentDoc = new Schema<IComment>(
  {
    comment: { type: String, required: true },
    user: { type: SchemaTypes.ObjectId, ref: "User" },
    issue: { type: SchemaTypes.ObjectId, ref: "Issue" },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", CommentDoc);
export default Comment;
