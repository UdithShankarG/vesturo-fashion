const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category');

async function addTestPosts() {
  try {
    // Connect to MongoDB
    const mongoUri = 'mongodb+srv://udithshankar5:UdiShrav1522%40@cluster0.eiewgxt.mongodb.net/vesturo?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get all categories
    const categories = await Category.find();
    console.log(`📁 Found ${categories.length} categories`);

    if (categories.length === 0) {
      console.log('❌ No categories found. Please add categories first.');
      return;
    }

    // Clear existing posts
    await Post.deleteMany({});
    console.log('🗑️ Cleared existing posts');

    // Simple test posts
    const testPosts = [
      {
        title: "Summer Casual Vibes",
        description: "Perfect casual outfit for summer days. Comfortable yet stylish with a modern twist.",
        hashtags: ["summer", "casual", "comfortable"],
        affiliateLinks: [
          {
            title: "White Cotton T-Shirt",
            url: "https://example.com/white-tshirt",
            price: "$29.99"
          }
        ],
        images: [
          {
            url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
            alt: "Summer casual outfit"
          }
        ],
        isPublished: true,
        featured: true,
        likes: 45,
        views: 234
      },
      {
        title: "Business Professional Look",
        description: "Sophisticated business attire that commands respect. Perfect for important meetings.",
        hashtags: ["business", "professional", "formal"],
        affiliateLinks: [
          {
            title: "Navy Blue Blazer",
            url: "https://example.com/navy-blazer",
            price: "$199.99"
          }
        ],
        images: [
          {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
            alt: "Business professional outfit"
          }
        ],
        isPublished: true,
        featured: true,
        likes: 67,
        views: 456
      },
      {
        title: "Street Style Edge",
        description: "Urban street style with an edgy twist. Bold patterns and contemporary cuts.",
        hashtags: ["streetstyle", "urban", "edgy"],
        affiliateLinks: [
          {
            title: "Graphic Print Hoodie",
            url: "https://example.com/graphic-hoodie",
            price: "$59.99"
          }
        ],
        images: [
          {
            url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop",
            alt: "Street style outfit"
          }
        ],
        isPublished: true,
        featured: false,
        likes: 89,
        views: 567
      }
    ];

    // Add test posts
    for (let i = 0; i < testPosts.length; i++) {
      const postData = testPosts[i];
      const randomCategory = categories[i % categories.length];
      
      const post = new Post({
        ...postData,
        category: randomCategory._id,
        slug: postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      });

      await post.save();
      console.log(`✅ Created post: ${post.title}`);
    }

    console.log(`🎉 Successfully added ${testPosts.length} test posts!`);
    
  } catch (error) {
    console.error('❌ Error adding test posts:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
addTestPosts();
