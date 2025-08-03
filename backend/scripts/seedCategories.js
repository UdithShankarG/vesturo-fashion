const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/Category");
const Admin = require("../models/Admin");

// Load environment variables
dotenv.config();

const sampleCategories = [
  {
    name: "Casual",
    description: "Comfortable everyday wear for relaxed occasions",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center",
    sortOrder: 1,
  },
  {
    name: "Formal",
    description: "Elegant attire for professional and formal events",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center",
    sortOrder: 2,
  },
  {
    name: "Street Style",
    description: "Urban fashion with an edge and contemporary flair",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop&crop=center",
    sortOrder: 3,
  },
  {
    name: "Vintage",
    description: "Classic styles with timeless appeal",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop&crop=center",
    sortOrder: 4,
  },
  {
    name: "Minimalist",
    description: "Clean, simple designs with sophisticated aesthetics",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&crop=center",
    sortOrder: 5,
  },
  {
    name: "Bohemian",
    description: "Free-spirited fashion with artistic influences",
    image:
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&h=400&fit=crop&crop=center",
    sortOrder: 6,
  },
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find admin user
    const admin = await Admin.findOne({ email: "admin@vesturo.com" });
    if (!admin) {
      console.error("Admin user not found. Please run seedAdmin.js first.");
      process.exit(1);
    }

    // Check if categories already exist
    const existingCategories = await Category.find();
    console.log(`${existingCategories.length} categories already exist`);

    // Create categories that don't exist
    const categories = [];
    for (const categoryData of sampleCategories) {
      const existing = await Category.findOne({ name: categoryData.name });
      if (!existing) {
        const category = await Category.create({
          ...categoryData,
          createdBy: admin._id,
        });
        categories.push(category);
        console.log(`Created: ${category.name}`);
      } else {
        console.log(`Exists: ${categoryData.name}`);
      }
    }

    console.log(`Successfully created ${categories.length} categories:`);
    categories.forEach((category) => {
      console.log(`- ${category.name} (${category.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
