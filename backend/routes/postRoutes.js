const express = require("express");
const {
  getPosts,
  getFeaturedPosts,
  getPostStats,
  getPost,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  likePost,
  sharePost,
} = require("../controllers/postController");

const { protect, authorize } = require("../middleware/auth");
const { uploadPostImages } = require("../config/cloudinary");

const router = express.Router();

// Public routes
router.get("/", getPosts);
router.get("/featured", getFeaturedPosts);
router.get("/stats", getPostStats);
router.get("/slug/:slug", getPostBySlug);
router.get("/:id", getPost);
router.put("/:id/like", likePost);
router.put("/:id/share", sharePost);

// Protected routes (Admin only)
router.post(
  "/",
  protect,
  authorize("admin", "super_admin"),
  uploadPostImages.array("images", 10),
  createPost
);
router.put(
  "/:id",
  protect,
  authorize("admin", "super_admin"),
  uploadPostImages.array("images", 10),
  updatePost
);
router.delete("/:id", protect, authorize("admin", "super_admin"), deletePost);

module.exports = router;
