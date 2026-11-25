import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { validateAuth } from "./auth.schema.js";
import { sendError, sendResponse } from "../../middlewares/errors.js";
import { Auth, type UserRole } from "./auth.model.js";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
interface RefreshTokenPayload extends JwtPayload {
  id: string;
}
// HANDLE REFRESH TOKEN
const handleRefreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken: string | undefined = req.cookies?.refreshToken;
    if (!refreshToken) {
      sendError(res, 401, "Refresh token is missing");
      return;
    }
    let decoded: RefreshTokenPayload;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY as string,
      ) as RefreshTokenPayload;
    } catch {
      sendError(res, 401, "Invalid or expired refresh token");
      return;
    }
    const user = await Auth.findById(decoded.id).select("+refreshToken");
    if (!user || !user.isActive || user.refreshToken !== refreshToken) {
      sendError(res, 401, "Refresh token is invalid or revoked");
      return;
    }
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendResponse(res, 200, "Token refreshed successfully", {
      token: newAccessToken,
      role: user.role as UserRole,
    });
  },
);
// LOGIN
const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, success } = validateAuth(req.body);
    if (!success) {
      sendError(res, 400, error.issues[0]?.message || "Invalid Input");
      return;
    }
    const normalizedEmail = String(req.body.email).toLowerCase().trim();
    const allowedEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase().trim();
    if (!allowedEmail || normalizedEmail !== allowedEmail) {
      sendError(res, 403, "Access denied for this account");
      return;
    }
    const user = await Auth.findOne({ email: normalizedEmail }).select(
      "+password",
    );
    if (!user) {
      sendError(res, 404, "User was not found");
      return;
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordMatch) {
      sendError(res, 400, "Invalid email or password!");
      return;
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const {
      password: _hiddenPassword,
      refreshToken: _hiddenRefresh,
      ...others
    } = user.toObject();

    sendResponse(res, 200, "User logged in successfully", {
      ...others,
      token: accessToken,
    });
    return;
  },
);

// LOGOUT
const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken: string | undefined = req.cookies?.refreshToken;

    if (refreshToken) {
      await Auth.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: "" } },
      );
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    sendResponse(res, 200, "Logged out successfully", null);
  },
);

// AUTH ME
const getAuthMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      sendError(res, 401, "Unauthorized: User context is missing");
      return;
    }

    const user = await Auth.findById(userId).select("-password -refreshToken");

    if (!user) {
      sendError(res, 404, "User was not found");
      return;
    }

    if (!user.isActive) {
      sendError(res, 403, "Account is inactive");
      return;
    }

    sendResponse(res, 200, "Authenticated user fetched successfully", user);
  },
);
export { login, logout, handleRefreshToken, getAuthMe };
