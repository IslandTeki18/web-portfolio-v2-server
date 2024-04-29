import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadProductImage } from "../services/upload.service.js";

const router = express.Router();

router.route("/:id").post(upload.array("images", 5), uploadProductImage);

export default router;
