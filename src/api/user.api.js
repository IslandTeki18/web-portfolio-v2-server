import express from "express";
const router = express.Router();
import {
  getAdminProfile,
  postAuthUser,
  putUpdateAdmin,
  refreshAuthToken,
} from "../services/user.service.js";
import { protect, admin, authLimiter } from "../middleware/auth.middleware.js";
import morgan from "morgan";

router.post(
  "/login",
  authLimiter,
  morgan(":method :url :status :res[content-length] - :response-time ms"),
  postAuthUser
);
router.post(
  "/refresh-token",
  authLimiter,
  morgan(":method :url :status :res[content-length] - :response-time ms"),
  refreshAuthToken
);
router
  .route("/settings")
  .put(
    protect,
    admin,
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    putUpdateAdmin
  )
  .get(
    protect,
    admin,
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    getAdminProfile
  );

export default router;
