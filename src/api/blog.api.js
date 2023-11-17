import express from "express";
const router = express.Router();
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  addCommentToBlogPost,
} from "../services/blog.service.js";
import { protect, admin } from "../middleware/auth.middleware.js";

router.route("/").get(getAllBlogPosts).post(protect, admin, createBlogPost);
router
  .route("/:id")
  .get(getBlogPostById)
  .put(protect, admin, updateBlogPost)
  .delete(protect, admin, deleteBlogPost);

router.route("/:id/comment").post(addCommentToBlogPost);
export default router;
