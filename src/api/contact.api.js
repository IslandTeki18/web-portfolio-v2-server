import express from "express";
const router = express.Router();
import {
  getAllContactInfo,
  postNewContactInfo,
  deleteContactInfo,
  updateContactInfo,
  getContactInfoById,
} from "../services/contact.service.js";
import { protect, admin } from "../middleware/auth.middleware.js";

router
  .route("/")
  .get(protect, admin, getAllContactInfo)
  .post(postNewContactInfo);
router
  .route("/:id")
  .delete(protect, admin, deleteContactInfo)
  .put(protect, admin, updateContactInfo)
  .get(protect, admin, getContactInfoById);

export default router;
