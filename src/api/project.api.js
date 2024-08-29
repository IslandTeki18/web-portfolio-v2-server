import express from "express";
const router = express.Router();
import {
  getAllProjects,
  getLimitedProjects,
  getProjectById,
  postNewProject,
  putProjectById,
  deleteProjectById,
  deleteProjectImage,
  createDeveloperFeedback,
  deleteDeveloperFeedback,
  updateDeveloperFeedback,
  createRelatedProjectObj,
  deleteRelatedProjectObj,
  updateRelatedProjectObj,
} from "../services/project.service.js";
import { protect, admin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

router
  .route("/")
  .get(getAllProjects)
  .post(protect, admin, upload.array("images"), postNewProject);
router.route("/limited").get(getLimitedProjects);
router
  .route("/:id")
  .get(getProjectById)
  .delete(protect, admin, deleteProjectById)
  .put(protect, admin, upload.array("images"), putProjectById);

router.route("/:id/image").delete(protect, admin, deleteProjectImage);
router.route("/:id/feedback").post(protect, admin, createDeveloperFeedback);
router
  .route("/:id/:feedback_id")
  .delete(protect, admin, deleteDeveloperFeedback);
router
  .route("/:id/:feedback_id/edit")
  .put(protect, admin, updateDeveloperFeedback);
router.post("/:id/related", protect, admin, createRelatedProjectObj);
router.delete(
  "/:id/:relatedProjectId/remove",
  protect,
  admin,
  deleteRelatedProjectObj
);
router.put(
  "/:id/:relatedProjectId/update",
  protect,
  admin,
  updateRelatedProjectObj
);
export default router;
