const mongoose = require("mongoose");

const affiliateLinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Affiliate link title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    url: {
      type: String,
      required: [true, "Affiliate URL is required"],
      trim: true,
      match: [
        /^https?:\/\/.+/,
        "Please enter a valid URL starting with http:// or https://",
      ],
    },
    icon: {
      type: String,
      default: "🔗",
    },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      minlength: [3, "Title must be at least 3 characters long"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Post description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: String, // Cloudinary public ID
        alt: {
          type: String,
          default: "",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    hashtags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, "Hashtag cannot exceed 30 characters"],
      },
    ],
    affiliateLinks: [affiliateLinkSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
      maxlength: [60, "SEO title cannot exceed 60 characters"],
    },
    seoDescription: {
      type: String,
      maxlength: [160, "SEO description cannot exceed 160 characters"],
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

// Create unique slug from title before saving
postSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and create unique one
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  // Set published date when publishing
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Update category post count after save
postSchema.post("save", async function () {
  if (this.category) {
    const Category = mongoose.model("Category");
    const category = await Category.findById(this.category);
    if (category) {
      await category.updatePostCount();
    }
  }
});

// Update category post count after remove
postSchema.post("remove", async function () {
  if (this.category) {
    const Category = mongoose.model("Category");
    const category = await Category.findById(this.category);
    if (category) {
      await category.updatePostCount();
    }
  }
});

// Increment views
postSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Increment likes
postSchema.methods.incrementLikes = function () {
  this.likes += 1;
  return this.save();
};

// Increment shares
postSchema.methods.incrementShares = function () {
  this.shares += 1;
  return this.save();
};

// Static method to get published posts
postSchema.statics.getPublishedPosts = function (options = {}) {
  const {
    category,
    page = 1,
    limit = 10,
    search,
    featured,
    sortBy = "createdAt",
    sortOrder = -1,
  } = options;

  const query = { isPublished: true };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { hashtags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  if (featured !== undefined) {
    query.featured = featured;
  }

  const sort = {};
  sort[sortBy] = sortOrder;

  return this.find(query)
    .populate("category", "name slug")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .select(
      "title slug description images hashtags category views likes shares featured createdAt publishedAt"
    );
};

// Static method to get featured posts
postSchema.statics.getFeaturedPosts = function (limit = 6) {
  return this.find({ isPublished: true, featured: true })
    .populate("category", "name slug")
    .sort({ sortOrder: 1, createdAt: -1 })
    .limit(limit)
    .select("title slug description images category");
};

// Create indexes
postSchema.index({ isPublished: 1 });
postSchema.index({ category: 1 });
postSchema.index({ featured: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ views: -1 });
postSchema.index({ likes: -1 });
postSchema.index({ title: "text", description: "text", hashtags: "text" });

module.exports = mongoose.model("Post", postSchema);
