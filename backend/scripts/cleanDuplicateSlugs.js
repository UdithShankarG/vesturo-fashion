const mongoose = require('mongoose');
const Post = require('../models/Post');
require('dotenv').config();

const cleanDuplicateSlugs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all posts with duplicate slugs
    const duplicates = await Post.aggregate([
      {
        $group: {
          _id: '$slug',
          count: { $sum: 1 },
          posts: { $push: { id: '$_id', title: '$title', createdAt: '$createdAt' } }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    console.log(`Found ${duplicates.length} duplicate slug groups`);

    for (const duplicate of duplicates) {
      console.log(`\nProcessing duplicate slug: "${duplicate._id}"`);
      
      // Sort by creation date, keep the oldest one
      const sortedPosts = duplicate.posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const keepPost = sortedPosts[0];
      const deleteIds = sortedPosts.slice(1).map(p => p.id);

      console.log(`Keeping post: ${keepPost.title} (${keepPost.id})`);
      console.log(`Deleting ${deleteIds.length} duplicate posts`);

      // Delete the duplicate posts
      await Post.deleteMany({ _id: { $in: deleteIds } });
    }

    console.log('\nCleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning duplicate slugs:', error);
    process.exit(1);
  }
};

cleanDuplicateSlugs();
