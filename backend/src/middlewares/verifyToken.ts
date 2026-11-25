import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Auth, type UserRole } from "../modules/auth/auth.model.js";
import { sendError } from "./errors.js";

interface AccessTokenPayload extends JwtPayload {
  id: string;
  role: UserRole;
}

const verifyToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, 401, "Unauthorized: Access token is missing");
      return;
    }

    const token = authHeader.split(" ")[1]?.trim();

    if (!token) {
      sendError(res, 401, "Unauthorized: Invalid token format");
      return;
    }

    let decoded: AccessTokenPayload;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string,
      ) as AccessTokenPayload;
    } catch {
      sendError(res, 401, "Unauthorized: Invalid or expired access token");
      return;
    }

    const user = await Auth.findById(decoded.id).select("role isActive");

    if (!user) {
      sendError(res, 401, "Unauthorized: User no longer exists");
      return;
    }

    if (!user.isActive) {
      sendError(res, 403, "Forbidden: Account is inactive");
      return;
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  },
);

export { verifyToken };
