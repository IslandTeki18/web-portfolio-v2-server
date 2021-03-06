import express from "express";
const router = express.Router();
import {
  getAllProjects,
  getLimitedProjects,
  getProjectById,
  postNewProject,
  putProjectById,
  deleteProjectById,
  createDeveloperFeedback,
  deleteDeveloperFeedback,
  updateDeveloperFeedback,
  projectModelChange,
} from "../services/project.service.js";
import { protect, admin } from "../middleware/auth.middleware.js";

router.route("/").get(getAllProjects).post(protect, admin, postNewProject);
router.route("/limited").get(getLimitedProjects);
router
  .route("/:id")
  .get(getProjectById)
  .delete(protect, admin, deleteProjectById)
  .put(protect, admin, putProjectById);

router.route("/:id/feedback").post(protect, admin, createDeveloperFeedback);
router
  .route("/:id/:feedback_id")
  .delete(protect, admin, deleteDeveloperFeedback);
router
  .route("/:id/:feedback_id/edit")
  .put(protect, admin, updateDeveloperFeedback);
export default router;
