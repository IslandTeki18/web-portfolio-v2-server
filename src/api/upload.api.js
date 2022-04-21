import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadProductImage } from "../services/upload.service.js";

const router = express.Router();

router.route("/").post(upload.single("project-image"), uploadProductImage);

export default router;
