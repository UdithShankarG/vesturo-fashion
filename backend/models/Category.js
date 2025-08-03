const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
      minlength: [2, "Category name must be at least 2 characters long"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    imagePublicId: {
      type: String, // For Cloudinary public ID if using cloud storage
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

// Update post count
categorySchema.methods.updatePostCount = async function () {
  const Post = mongoose.model("Post");
  this.postCount = await Post.countDocuments({
    category: this._id,
    isPublished: true,
  });
  return this.save();
};

// Static method to get active categories
categorySchema.statics.getActiveCategories = function () {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .select("name slug image postCount");
};

// Static method to get category with posts
categorySchema.statics.getCategoryWithPosts = function (
  slug,
  page = 1,
  limit = 10
) {
  return this.aggregate([
    { $match: { slug: slug, isActive: true } },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "category",
        as: "posts",
        pipeline: [
          { $match: { isPublished: true } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              title: 1,
              description: 1,
              images: { $slice: ["$images", 1] }, // Only first image
              hashtags: 1,
              createdAt: 1,
              slug: 1,
            },
          },
        ],
      },
    },
  ]);
};

// Create indexes
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ createdBy: 1 });

module.exports = mongoose.model("Category", categorySchema);
