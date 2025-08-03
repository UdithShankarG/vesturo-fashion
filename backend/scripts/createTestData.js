const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Category = require("../models/Category");
const Post = require("../models/Post");

async function createTestData() {
  try {
    // Connect to MongoDB
    const mongoUri =
      "mongodb+srv://udithshankar5:UdiShrav1522%40@cluster0.eiewgxt.mongodb.net/vesturo?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Create admin user
    let admin = await Admin.findOne({ email: "udithshankar5@gmail.com" });
    if (!admin) {
      admin = await Admin.create({
        email: "udithshankar5@gmail.com",
        password: "UdiShrav1522@",
        name: "Udith Shankar",
        dateOfBirth: new Date("2003-01-15"),
      });
      console.log("✅ Created admin user");
    } else {
      console.log("✅ Admin user already exists");
    }

    // Clear existing data
    await Category.deleteMany({});
    await Post.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Create categories
    const categories = [
      {
        name: "Summer Casual",
        description: "Comfortable and stylish summer outfits",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        isActive: true,
        createdBy: admin._id,
      },
      {
        name: "Business Professional",
        description: "Sophisticated business attire",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        isActive: true,
        createdBy: admin._id,
      },
      {
        name: "Street Style",
        description: "Urban contemporary fashion",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop",
        isActive: true,
        createdBy: admin._id,
      },
      {
        name: "Vintage Romance",
        description: "Timeless romantic pieces",
        image:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop",
        isActive: true,
        createdBy: admin._id,
      },
      {
        name: "Minimalist Chic",
        description: "Clean lines and neutral tones",
        image:
          "https://images.unsplash.com/photo-1544957992-20514f595d6f?w=400&h=600&fit=crop",
        isActive: true,
        createdBy: admin._id,
      },
      {
        name: "Bohemian Dreams",
        description: "Free-spirited boho style",
        image:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop",
        isActive: true,
        createdBy: admin._id,
      },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create posts
    const posts = [
      {
        title: "Perfect Summer Day Look",
        description:
          "Light and breezy outfit perfect for warm summer days. Comfortable yet stylish with a modern twist.",
        category: createdCategories[0]._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
            alt: "Summer casual outfit",
          },
        ],
        hashtags: ["summer", "casual", "comfortable"],
        affiliateLinks: [
          {
            title: "White Cotton T-Shirt",
            url: "https://example.com/white-tshirt",
          },
          {
            title: "Denim Shorts",
            url: "https://example.com/denim-shorts",
          },
        ],
        isPublished: true,
        featured: true,
        likes: 45,
        views: 234,
      },
      {
        title: "Executive Power Dressing",
        description:
          "Sophisticated business attire that commands respect. Perfect for important meetings and presentations.",
        category: createdCategories[1]._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
            alt: "Business professional outfit",
          },
        ],
        hashtags: ["business", "professional", "formal"],
        affiliateLinks: [
          {
            title: "Navy Blue Blazer",
            url: "https://example.com/navy-blazer",
          },
          {
            title: "White Dress Shirt",
            url: "https://example.com/white-shirt",
          },
        ],
        isPublished: true,
        featured: true,
        likes: 67,
        views: 456,
      },
      {
        title: "Urban Street Vibes",
        description:
          "Contemporary street style with an edgy twist. Bold patterns and modern cuts for the fashion-forward.",
        category: createdCategories[2]._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop",
            alt: "Street style outfit",
          },
        ],
        hashtags: ["streetstyle", "urban", "edgy"],
        affiliateLinks: [
          {
            title: "Graphic Print Hoodie",
            url: "https://example.com/graphic-hoodie",
          },
        ],
        isPublished: true,
        featured: false,
        likes: 89,
        views: 567,
      },
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`✅ Created ${createdPosts.length} posts`);

    console.log("🎉 Test data created successfully!");
    console.log("📧 Admin Email: admin@vesturo.com");
    console.log("🔑 Admin Password: admin123");
  } catch (error) {
    console.error("❌ Error creating test data:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the script
createTestData();
