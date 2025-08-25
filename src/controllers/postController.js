const Post = require('../models/Post');
const Media = require('../models/Media');
const mongoose = require('mongoose');

// Helper to save image buffers to MongoDB
const saveImages = async (files) => {
  const ids = [];
  for (const file of files) {
    const media = await Media.create({ filename: file.originalname, contentType: file.mimetype, data: file.buffer });
    ids.push(String(media._id));
  }
  return ids;
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, description, user_id } = req.body;
    
    // Handle image upload
    let image = null;
    if (req.files && req.files.length > 0) {
      const ids = await saveImages([req.files[0]]);
      image = ids[0];
    }

    const post = await Post.create({ title, description, image, user_id });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: error.message });
  }
};



// Update post
exports.updatePost = async (req, res) => {
  try {
  const { title, description } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Handle image upload (only one image allowed)
    if (req.files && req.files.length > 0) {
      // Delete old image if new image is received
      if (post.image) {
        try { await Media.findByIdAndDelete(post.image); } catch {}
      }
      // Save only the first new image
      const newImages = await saveImages([req.files[0]]);
      post.image = newImages[0];
    }

    post.title = title ?? post.title;
    post.description = description ?? post.description;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete associated image
    if (post.image) {
      try { await Media.findByIdAndDelete(post.image); } catch {}
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: error.message });
  }
};

// Like or unlike a post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const alreadyLiked = post.likedBy.includes(userId);
    if (alreadyLiked) {
      post.likedBy.pull(userId);
      post.likeCount = Math.max(0, post.likeCount - 1);
      await post.save();
      return res.json({ message: 'Post unliked', likeCount: post.likeCount });
    } else {
      post.likedBy.push(userId);
      post.likeCount += 1;
      await post.save();
      return res.json({ message: 'Post liked', likeCount: post.likeCount });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts by user ID
exports.getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ user_id: userId }).sort({ created_at: -1 }); //descending oder
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wall posts (exclude current user's own and liked posts)
exports.getWallPosts = async (req, res) => {
  try {
    // Get the current user's ID from the route parameter
    const userId = req.params.userId;
  // Pagination removed; will fetch all posts matching filter
    // If userId is not provided, return a 400 error
    if (!userId) return res.status(400).json({ message: 'userId required' });
    // Build a filter to exclude posts created by or liked by the current user
    const filter = {
      user_id: { $ne: userId }, // Exclude posts created by the current user
      likedBy: { $ne: userId }  // Exclude posts liked by the current user
    };
  // Fetch all posts matching filter, sorted by newest first
  const posts = await Post.find(filter).sort({ created_at: -1 });
  // Respond with all posts
  res.json({ posts });
  } catch (error) {
    // Handle errors and respond with 500 status
    res.status(500).json({ message: error.message });
  }
};