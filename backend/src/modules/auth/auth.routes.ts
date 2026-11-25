import express from "express";
import {
  getAuthMe,
  handleRefreshToken,
  login,
  logout,
} from "./auth.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", handleRefreshToken);
router.get("/me", verifyToken, getAuthMe);

export default router;
