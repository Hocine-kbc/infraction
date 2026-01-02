import mongoose, { Schema, Document } from "mongoose";

export interface INotification {
  message: string;
  read: boolean;
  date: Date;
}

export interface IResponse {
  message: string;
  adminId: string;
  date: Date;
}

export interface IReport extends Document {
  userId: string;
  type: string;
  description: string;
  location: string;
  date: Date;
  status: "soumis" | "en_cours" | "resolu";
  notifications?: INotification[];
  responses?: IResponse[];
}

const NotificationSchema: Schema<INotification> = new Schema({
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const ResponseSchema: Schema<IResponse> = new Schema({
  message: { type: String, required: true },
  adminId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ReportSchema: Schema<IReport> = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["soumis", "en_cours", "resolu"],
      default: "soumis",
    },
    notifications: { type: [NotificationSchema], default: [] },
    responses: { type: [ResponseSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("Report", ReportSchema);
