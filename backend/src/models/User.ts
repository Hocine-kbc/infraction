import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  role: "user" | "admin";
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
});

export default mongoose.model<IUser>("User", UserSchema);
