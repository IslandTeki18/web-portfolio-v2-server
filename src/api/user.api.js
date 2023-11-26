import express from "express";
const router = express.Router();
import {
  getAdminProfile,
  postAuthUser,
  putUpdateAdmin,
} from "../services/user.service.js";
import { protect, admin } from "../middleware/auth.middleware.js";

router.post("/login", postAuthUser);
router
  .route("/settings")
  .put(protect, admin, putUpdateAdmin)
  .get(protect, admin, getAdminProfile);

export default router;
