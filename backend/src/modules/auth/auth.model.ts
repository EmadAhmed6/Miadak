import { model, Schema, Document } from "mongoose";
import type { IAuthSchema } from "./auth.schema.js";
import jwt from "jsonwebtoken";
export type UserRole = "PATIENT" | "DOCTOR" | "RECEPTIONIST" | "ADMIN";
interface IAuth extends Document, IAuthSchema {
  fullName: string;
  role: UserRole;
  isActive: boolean;
  refreshToken: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

const AuthSchema = new Schema<IAuth>(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN"],
      default: "PATIENT",
    },
    refreshToken: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

AuthSchema.methods.generateAccessToken = function (this: IAuth): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "15m",
    },
  );
};

AuthSchema.methods.generateRefreshToken = function (this: IAuth): string {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_KEY as string, {
    expiresIn: "30d",
  });
};
export const Auth = model<IAuth>("Auth", AuthSchema);
