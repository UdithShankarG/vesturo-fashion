const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('../models/Post');
const Category = require('../models/Category');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config();

const samplePosts = [
  {
    title: 'Effortless Summer Casual Look',
    description: 'Perfect for those warm summer days when you want to look stylish yet comfortable. This outfit combines breathable fabrics with trendy cuts for the ultimate casual vibe.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
        alt: 'Summer casual outfit',
        isPrimary: true
      }
    ],
    hashtags: ['summer', 'casual', 'comfortable', 'trendy'],
    affiliateLinks: [
      {
        name: 'Cotton T-Shirt',
        url: 'https://example.com/tshirt',
        icon: '👕'
      },
      {
        name: 'Denim Shorts',
        url: 'https://example.com/shorts',
        icon: '🩳'
      }
    ],
    isPublished: true,
    featured: true,
    categoryName: 'Casual'
  },
  {
    title: 'Professional Business Attire',
    description: 'Make a lasting impression in the boardroom with this sophisticated business ensemble. Tailored to perfection and designed for the modern professional.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        alt: 'Business formal outfit',
        isPrimary: true
      }
    ],
    hashtags: ['business', 'formal', 'professional', 'sophisticated'],
    affiliateLinks: [
      {
        name: 'Tailored Blazer',
        url: 'https://example.com/blazer',
        icon: '🧥'
      },
      {
        name: 'Dress Shirt',
        url: 'https://example.com/shirt',
        icon: '👔'
      }
    ],
    isPublished: true,
    featured: true,
    categoryName: 'Formal'
  },
  {
    title: 'Urban Street Style Edge',
    description: 'Channel your inner rebel with this edgy street style look. Bold patterns and urban aesthetics come together for a statement-making outfit.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop',
        alt: 'Street style outfit',
        isPrimary: true
      }
    ],
    hashtags: ['streetstyle', 'urban', 'edgy', 'bold'],
    affiliateLinks: [
      {
        name: 'Graphic Hoodie',
        url: 'https://example.com/hoodie',
        icon: '👘'
      },
      {
        name: 'Distressed Jeans',
        url: 'https://example.com/jeans',
        icon: '👖'
      }
    ],
    isPublished: true,
    featured: false,
    categoryName: 'Street Style'
  },
  {
    title: 'Timeless Vintage Charm',
    description: 'Step back in time with this classic vintage-inspired ensemble. Timeless pieces that never go out of style, perfect for any occasion.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
        alt: 'Vintage style outfit',
        isPrimary: true
      }
    ],
    hashtags: ['vintage', 'classic', 'timeless', 'retro'],
    affiliateLinks: [
      {
        name: 'Vintage Dress',
        url: 'https://example.com/dress',
        icon: '👗'
      },
      {
        name: 'Classic Cardigan',
        url: 'https://example.com/cardigan',
        icon: '🧶'
      }
    ],
    isPublished: true,
    featured: true,
    categoryName: 'Vintage'
  },
  {
    title: 'Clean Minimalist Aesthetic',
    description: 'Less is more with this clean, minimalist approach to fashion. Simple lines and neutral tones create an effortlessly chic look.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&h=500&fit=crop',
        alt: 'Minimalist outfit',
        isPrimary: true
      }
    ],
    hashtags: ['minimalist', 'clean', 'simple', 'neutral'],
    affiliateLinks: [
      {
        name: 'Basic White Tee',
        url: 'https://example.com/tee',
        icon: '👕'
      },
      {
        name: 'Tailored Trousers',
        url: 'https://example.com/trousers',
        icon: '👖'
      }
    ],
    isPublished: true,
    featured: false,
    categoryName: 'Minimalist'
  }
];

const seedPosts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await Admin.findOne({ email: 'admin@vesturo.com' });
    if (!admin) {
      console.error('Admin user not found. Please run seedAdmin.js first.');
      process.exit(1);
    }

    // Get all categories
    const categories = await Category.find();
    if (categories.length === 0) {
      console.error('No categories found. Please run seedCategories.js first.');
      process.exit(1);
    }

    // Check if posts already exist
    const existingPosts = await Post.find();
    if (existingPosts.length > 0) {
      console.log(`${existingPosts.length} posts already exist`);
      process.exit(0);
    }

    // Create posts
    const posts = [];
    for (const postData of samplePosts) {
      const category = categories.find(cat => cat.name === postData.categoryName);
      if (category) {
        const { categoryName, ...postFields } = postData;
        const post = await Post.create({
          ...postFields,
          category: category._id,
          createdBy: admin._id
        });
        posts.push(post);
        console.log(`Created post: ${post.title}`);
      } else {
        console.log(`Category not found: ${postData.categoryName}`);
      }
    }

    // Update category post counts
    for (const category of categories) {
      await category.updatePostCount();
    }

    console.log(`Successfully created ${posts.length} posts`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
};

seedPosts();
