import express from "express";
const router = express.Router();
import {
  getAdminProfile,
  postAuthUser,
  putUpdateAdmin,
  refreshAuthToken,
} from "../services/user.service.js";
import { protect, admin, authLimiter } from "../middleware/auth.middleware.js";

router.post("/login", authLimiter, postAuthUser);
router.post("/refresh-token", authLimiter, refreshAuthToken);
router
  .route("/settings")
  .put(protect, admin, putUpdateAdmin)
  .get(protect, admin, getAdminProfile);

export default router;
