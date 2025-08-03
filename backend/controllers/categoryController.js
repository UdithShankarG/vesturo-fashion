const Category = require("../models/Category");
const { deleteImage } = require("../config/cloudinary");

// @desc    Get all categories
// @route   GET /api/vesturo/category
// @access  Public
const getCategories = async (req, res) => {
  try {
    const { active = true, page = 1, limit = 20 } = req.query;

    const query = active === "false" ? {} : { isActive: true };

    const categories = await Category.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("name slug image postCount isActive sortOrder createdAt");

    const total = await Category.countDocuments(query);

    res.status(200).json({
      success: true,
      count: categories.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get single category
// @route   GET /api/vesturo/category/:id
// @access  Public
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get single category by slug
// @route   GET /api/vesturo/category/slug/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate(
      "createdBy",
      "name email"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get category by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create new category
// @route   POST /api/vesturo/category
// @access  Private (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      image: req.file.path,
      imagePublicId: req.file.filename,
      sortOrder: sortOrder || 0,
      createdBy: req.admin.id,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    // Delete uploaded image if category creation fails
    if (req.file && req.file.filename) {
      try {
        await deleteImage(req.file.filename);
      } catch (deleteError) {
        console.error("Error deleting uploaded image:", deleteError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update category
// @route   PUT /api/vesturo/category/:id
// @access  Private (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { name, description, sortOrder, isActive } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    // Update fields
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle image update
    if (req.file) {
      // Delete old image
      if (category.imagePublicId) {
        try {
          await deleteImage(category.imagePublicId);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }

      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    // Delete uploaded image if update fails
    if (req.file && req.file.filename) {
      try {
        await deleteImage(req.file.filename);
      } catch (deleteError) {
        console.error("Error deleting uploaded image:", deleteError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/vesturo/category/:id
// @access  Private (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has posts
    const Post = require("../models/Post");
    const postCount = await Post.countDocuments({ category: category._id });

    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${postCount} posts associated with it.`,
      });
    }

    // Delete image from Cloudinary
    if (category.imagePublicId) {
      try {
        await deleteImage(category.imagePublicId);
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting category",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
