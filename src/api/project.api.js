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
import morgan from "morgan";

// Project routes
router
  .route("/")
  .get(
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    getAllProjects
  )
  .post(
    protect,
    admin,
    upload.array("images"),
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    postNewProject
  );
router
  .route("/limited")
  .get(
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    getLimitedProjects
  );
router
  .route("/:id")
  .get(
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    getProjectById
  )
  .delete(
    protect,
    admin,
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    deleteProjectById
  )
  .put(
    protect,
    admin,
    upload.array("images"),
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    putProjectById
  );
router
  .route("/:id/image")
  .delete(
    protect,
    admin,
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    deleteProjectImage
  );

// Developer feedback
router.route("/:id/feedback").post(protect, admin, createDeveloperFeedback);
router
  .route("/:id/:feedback_id")
  .delete(
    protect,
    admin,
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    deleteDeveloperFeedback
  );
router
  .route("/:id/:feedback_id/edit")
  .put(
    protect,
    admin,
    morgan(":method :url :status :res[content-length] - :response-time ms"),
    updateDeveloperFeedback
  );

// Related projects
router.post(
  "/:id/related",
  protect,
  admin,
  morgan(":method :url :status :res[content-length] - :response-time ms"),
  createRelatedProjectObj
);
router.delete(
  "/:id/:relatedProjectId/remove",
  protect,
  admin,
  morgan(":method :url :status :res[content-length] - :response-time ms"),
  deleteRelatedProjectObj
);
router.put(
  "/:id/:relatedProjectId/update",
  protect,
  admin,
  morgan(":method :url :status :res[content-length] - :response-time ms"),
  updateRelatedProjectObj
);
export default router;
