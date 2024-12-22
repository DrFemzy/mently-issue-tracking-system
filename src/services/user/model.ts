import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import userService, { ContextNames } from ".";

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ContextNames;
  refreshToken: string[];

  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserDoc = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    refreshToken: { type: [String], default: [] },
  },
  { timestamps: true }
);

// extend matchPassword function unto user
UserDoc.methods.matchPassword = async function (enteredPassword: string) {
  const hashedEnteredPassword = userService.hashPassword(enteredPassword);

  return hashedEnteredPassword === this.password;
};

UserDoc.set("toJSON", {
  transform: function (_, ret) {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

const User = mongoose.model<IUser>("User", UserDoc);
export default User;
