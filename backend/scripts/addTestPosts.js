const mongoose = require("mongoose");
const Post = require("../models/Post");
const Category = require("../models/Category");
require("dotenv").config();

const testPosts = [
  {
    title: "Summer Casual Vibes",
    description:
      "Perfect casual outfit for summer days. Comfortable yet stylish with a modern twist. This look combines comfort with contemporary fashion trends.",
    hashtags: ["summer", "casual", "comfortable", "trendy", "everyday"],
    affiliateLinks: [
      {
        title: "White Cotton T-Shirt",
        url: "https://example.com/white-tshirt",
        price: "$29.99",
      },
      {
        title: "Blue Denim Jeans",
        url: "https://example.com/blue-jeans",
        price: "$79.99",
      },
      {
        title: "White Sneakers",
        url: "https://example.com/white-sneakers",
        price: "$89.99",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        alt: "Summer casual outfit",
      },
    ],
    isPublished: true,
    featured: true,
    likes: 45,
    shares: 12,
    views: 234,
  },
  {
    title: "Business Professional Look",
    description:
      "Sophisticated business attire that commands respect. Perfect for important meetings and professional events. Classic yet contemporary styling.",
    hashtags: ["business", "professional", "formal", "office", "sophisticated"],
    affiliateLinks: [
      {
        title: "Navy Blue Blazer",
        url: "https://example.com/navy-blazer",
        price: "$199.99",
      },
      {
        title: "White Dress Shirt",
        url: "https://example.com/white-shirt",
        price: "$69.99",
      },
      {
        title: "Black Dress Pants",
        url: "https://example.com/black-pants",
        price: "$89.99",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        alt: "Business professional outfit",
      },
    ],
    isPublished: true,
    featured: true,
    likes: 67,
    shares: 23,
    views: 456,
  },
  {
    title: "Street Style Edge",
    description:
      "Urban street style with an edgy twist. Bold patterns and contemporary cuts that make a statement. Perfect for the fashion-forward individual.",
    hashtags: ["streetstyle", "urban", "edgy", "bold", "contemporary"],
    affiliateLinks: [
      {
        title: "Graphic Print Hoodie",
        url: "https://example.com/graphic-hoodie",
        price: "$59.99",
      },
      {
        title: "Distressed Jeans",
        url: "https://example.com/distressed-jeans",
        price: "$99.99",
      },
      {
        title: "High-Top Sneakers",
        url: "https://example.com/high-top-sneakers",
        price: "$129.99",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop",
        alt: "Street style outfit",
      },
    ],
    isPublished: true,
    featured: false,
    likes: 89,
    shares: 34,
    views: 567,
  },
  {
    title: "Vintage Romance",
    description:
      "Romantic vintage-inspired look with delicate details. Timeless pieces that never go out of style. Perfect for special occasions and romantic dates.",
    hashtags: ["vintage", "romantic", "timeless", "delicate", "feminine"],
    affiliateLinks: [
      {
        title: "Floral Midi Dress",
        url: "https://example.com/floral-dress",
        price: "$149.99",
      },
      {
        title: "Pearl Necklace",
        url: "https://example.com/pearl-necklace",
        price: "$79.99",
      },
      {
        title: "Vintage Heels",
        url: "https://example.com/vintage-heels",
        price: "$119.99",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop",
        alt: "Vintage romantic outfit",
      },
    ],
    isPublished: true,
    featured: true,
    likes: 123,
    shares: 45,
    views: 789,
  },
  {
    title: "Minimalist Chic",
    description:
      "Clean lines and neutral tones create the perfect minimalist look. Less is more with this sophisticated and effortless style approach.",
    hashtags: ["minimalist", "clean", "neutral", "sophisticated", "effortless"],
    affiliateLinks: [
      {
        title: "Beige Trench Coat",
        url: "https://example.com/beige-trench",
        price: "$249.99",
      },
      {
        title: "White Button-Up Shirt",
        url: "https://example.com/white-button-up",
        price: "$89.99",
      },
      {
        title: "Black Ankle Boots",
        url: "https://example.com/black-boots",
        price: "$159.99",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop",
        alt: "Minimalist chic outfit",
      },
    ],
    isPublished: true,
    featured: false,
    likes: 78,
    shares: 19,
    views: 345,
  },
  {
    title: "Bohemian Dreams",
    description:
      "Free-spirited bohemian style with flowing fabrics and earthy tones. Perfect for festivals, beach days, and expressing your creative side.",
    hashtags: ["bohemian", "boho", "flowing", "earthy", "creative"],
    affiliateLinks: [
      {
        title: "Maxi Floral Dress",
        url: "https://example.com/maxi-dress",
        price: "$129.99",
      },
      {
        title: "Fringe Bag",
        url: "https://example.com/fringe-bag",
        price: "$69.99",
      },
      {
        title: "Leather Sandals",
        url: "https://example.com/leather-sandals",
        price: "$89.99",
      },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop",
        alt: "Bohemian style outfit",
      },
    ],
    isPublished: true,
    featured: true,
    likes: 156,
    shares: 67,
    views: 892,
  },
];

async function addTestPosts() {
  try {
    // Connect to MongoDB
    const mongoUri =
      "mongodb+srv://vesturo:vesturo123@cluster0.mongodb.net/vesturo?retryWrites=true&w=majority";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Get all categories
    const categories = await Category.find();
    console.log(`Found ${categories.length} categories`);

    if (categories.length === 0) {
      console.log("No categories found. Please add categories first.");
      return;
    }

    // Clear existing posts
    await Post.deleteMany({});
    console.log("Cleared existing posts");

    // Add test posts with random categories
    for (let i = 0; i < testPosts.length; i++) {
      const postData = testPosts[i];
      const randomCategory = categories[i % categories.length];

      const post = new Post({
        ...postData,
        category: randomCategory._id,
        slug: postData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      });

      await post.save();
      console.log(`Created post: ${post.title}`);
    }

    console.log(`Successfully added ${testPosts.length} test posts!`);
  } catch (error) {
    console.error("Error adding test posts:", error);
    console.error("Full error:", error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the script
addTestPosts();
