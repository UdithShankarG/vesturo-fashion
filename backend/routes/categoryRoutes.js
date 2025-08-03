const express = require("express");
const {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect, authorize } = require("../middleware/auth");
const { uploadCategoryImage } = require("../config/cloudinary");

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategory);

// Protected routes (Admin only)
router.post(
  "/",
  protect,
  authorize("admin", "super_admin"),
  uploadCategoryImage.single("image"),
  createCategory
);
router.put(
  "/:id",
  protect,
  authorize("admin", "super_admin"),
  uploadCategoryImage.single("image"),
  updateCategory
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "super_admin"),
  deleteCategory
);

module.exports = router;
