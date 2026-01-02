import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  reportId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
