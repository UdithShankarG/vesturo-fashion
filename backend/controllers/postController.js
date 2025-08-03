const Post = require("../models/Post");
const Category = require("../models/Category");
const { deleteImage } = require("../config/cloudinary");

// @desc    Get post statistics
// @route   GET /api/vesturo/post/stats
// @access  Public
const getPostStats = async (req, res) => {
  try {
    // Get total published posts count
    const totalPosts = await Post.countDocuments({ isPublished: true });

    // Get total posts by category
    const postsByCategory = await Post.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      { $project: { categoryName: "$categoryInfo.name", count: 1 } },
    ]);

    // Get featured posts count
    const featuredPosts = await Post.countDocuments({
      isPublished: true,
      featured: true,
    });

    // Format number for display
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
      }
      return num.toString();
    };

    res.status(200).json({
      success: true,
      data: {
        totalPosts: {
          count: totalPosts,
          formatted: formatNumber(totalPosts),
        },
        featuredPosts: {
          count: featuredPosts,
          formatted: formatNumber(featuredPosts),
        },
        postsByCategory,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching post stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post statistics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// @desc    Get all posts
// @route   GET /api/vesturo/post
// @access  Public
const getPosts = async (req, res) => {
  try {
    const {
      category,
      page = 1,
      limit = 10,
      search,
      featured,
      published = true,
      sortBy = "createdAt",
      sortOrder = -1,
    } = req.query;

    const options = {
      category,
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      featured:
        featured === "true" ? true : featured === "false" ? false : undefined,
      sortBy,
      sortOrder: parseInt(sortOrder),
    };

    let posts;
    let total;

    if (published === "true" || published === true) {
      posts = await Post.getPublishedPosts(options);

      // Get total count for pagination
      const countQuery = { isPublished: true };
      if (category) countQuery.category = category;
      if (search) {
        countQuery.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { hashtags: { $in: [new RegExp(search, "i")] } },
        ];
      }
      if (featured !== undefined) countQuery.featured = featured === "true";

      total = await Post.countDocuments(countQuery);
    } else {
      // Admin view - all posts
      const query = {};
      if (category) query.category = category;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { hashtags: { $in: [new RegExp(search, "i")] } },
        ];
      }
      if (featured !== undefined) query.featured = featured === "true";

      const sort = {};
      sort[sortBy] = parseInt(sortOrder);

      posts = await Post.find(query)
        .populate("category", "name slug")
        .populate("createdBy", "name email")
        .sort(sort)
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));

      total = await Post.countDocuments(query);
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get featured posts
// @route   GET /api/vesturo/post/featured
// @access  Public
const getFeaturedPosts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const posts = await Post.getFeaturedPosts(parseInt(limit));

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get featured posts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured posts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get single post
// @route   GET /api/vesturo/post/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("category", "name slug")
      .populate("createdBy", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increment views for published posts
    if (post.isPublished) {
      await post.incrementViews();
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get post by slug
// @route   GET /api/vesturo/post/slug/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      isPublished: true,
    })
      .populate("category", "name slug")
      .populate("createdBy", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increment views
    await post.incrementViews();

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get post by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create new post
// @route   POST /api/vesturo/post
// @access  Private (Admin only)
const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      hashtags,
      affiliateLinks,
      isPublished = false,
      featured = false,
      sortOrder = 0,
      seoTitle,
      seoDescription,
    } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    // Process images
    const images = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      alt: `${title} - Image ${index + 1}`,
      isPrimary: index === 0,
    }));

    // Process hashtags
    const processedHashtags = hashtags
      ? (Array.isArray(hashtags) ? hashtags : hashtags.split(","))
          .map((tag) => tag.trim().toLowerCase().replace("#", ""))
          .filter((tag) => tag.length > 0)
      : [];

    // Process affiliate links
    const processedAffiliateLinks = affiliateLinks
      ? typeof affiliateLinks === "string"
        ? JSON.parse(affiliateLinks)
        : affiliateLinks
      : [];

    // Create post
    const post = await Post.create({
      title,
      description,
      category,
      images,
      hashtags: processedHashtags,
      affiliateLinks: processedAffiliateLinks,
      isPublished: isPublished === "true" || isPublished === true,
      featured: featured === "true" || featured === true,
      sortOrder: parseInt(sortOrder) || 0,
      seoTitle,
      seoDescription,
      createdBy: req.admin.id,
    });

    // Update category post count
    await categoryExists.updatePostCount();

    const populatedPost = await Post.findById(post._id)
      .populate("category", "name slug")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create post error:", error);

    // Delete uploaded images if post creation fails
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await deleteImage(file.filename);
        } catch (deleteError) {
          console.error("Error deleting uploaded image:", deleteError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update post
// @route   PUT /api/vesturo/post/:id
// @access  Private (Admin only)
const updatePost = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      hashtags,
      affiliateLinks,
      isPublished,
      featured,
      sortOrder,
      seoTitle,
      seoDescription,
    } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Verify category exists if provided
    if (category && category !== post.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }
    }

    // Update fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (isPublished !== undefined)
      updateData.isPublished = isPublished === "true" || isPublished === true;
    if (featured !== undefined)
      updateData.featured = featured === "true" || featured === true;
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder);
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined)
      updateData.seoDescription = seoDescription;

    // Process hashtags
    if (hashtags) {
      updateData.hashtags = (
        Array.isArray(hashtags) ? hashtags : hashtags.split(",")
      )
        .map((tag) => tag.trim().toLowerCase().replace("#", ""))
        .filter((tag) => tag.length > 0);
    }

    // Process affiliate links
    if (affiliateLinks) {
      updateData.affiliateLinks =
        typeof affiliateLinks === "string"
          ? JSON.parse(affiliateLinks)
          : affiliateLinks;
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      // Delete old images
      for (const image of post.images) {
        if (image.publicId) {
          try {
            await deleteImage(image.publicId);
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
          }
        }
      }

      // Add new images
      updateData.images = req.files.map((file, index) => ({
        url: file.path,
        publicId: file.filename,
        alt: `${title || post.title} - Image ${index + 1}`,
        isPrimary: index === 0,
      }));
    }

    const oldCategory = post.category;

    post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name slug")
      .populate("createdBy", "name email");

    // Update category post counts
    if (category && category !== oldCategory.toString()) {
      const oldCategoryDoc = await Category.findById(oldCategory);
      const newCategoryDoc = await Category.findById(category);

      if (oldCategoryDoc) await oldCategoryDoc.updatePostCount();
      if (newCategoryDoc) await newCategoryDoc.updatePostCount();
    } else if (isPublished !== undefined) {
      const categoryDoc = await Category.findById(post.category._id);
      if (categoryDoc) await categoryDoc.updatePostCount();
    }

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update post error:", error);

    // Delete uploaded images if update fails
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await deleteImage(file.filename);
        } catch (deleteError) {
          console.error("Error deleting uploaded image:", deleteError);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/vesturo/post/:id
// @access  Private (Admin only)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Delete images from Cloudinary
    for (const image of post.images) {
      if (image.publicId) {
        try {
          await deleteImage(image.publicId);
        } catch (deleteError) {
          console.error("Error deleting image:", deleteError);
        }
      }
    }

    const categoryId = post.category;

    await Post.findByIdAndDelete(req.params.id);

    // Update category post count
    const category = await Category.findById(categoryId);
    if (category) {
      await category.updatePostCount();
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Increment post likes
// @route   PUT /api/vesturo/post/:id/like
// @access  Public
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!post.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Cannot like unpublished post",
      });
    }

    await post.incrementLikes();

    res.status(200).json({
      success: true,
      message: "Post liked successfully",
      likes: post.likes,
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while liking post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Increment post shares
// @route   PUT /api/vesturo/post/:id/share
// @access  Public
const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!post.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Cannot share unpublished post",
      });
    }

    await post.incrementShares();

    res.status(200).json({
      success: true,
      message: "Post shared successfully",
      shares: post.shares,
    });
  } catch (error) {
    console.error("Share post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sharing post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
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
};
