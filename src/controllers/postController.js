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
    let image_url = null;
    let images = [];
    if (req.files && req.files.length > 0) {
      const ids = await saveImages(req.files);
      images = ids;
      image_url = ids[0] ? `/api/media/${ids[0]}` : null;
    }

    const post = await Post.create({ title, description, image_url, images, user_id });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all posts with pagination and filters
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, job_type, location, search } = req.query;
    const numericPage = parseInt(page, 10) || 1;
    const numericLimit = parseInt(limit, 10) || 10;
    const skip = (numericPage - 1) * numericLimit;

    const filter = {};
    if (job_type) filter.job_type = job_type;
    if (location) filter.location = location;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [posts, count] = await Promise.all([
      Post.find(filter).sort({ created_at: -1 }).skip(skip).limit(numericLimit),
      Post.countDocuments(filter)
    ]);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(count / numericLimit),
      currentPage: numericPage,
      totalPosts: count
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, job_type } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Handle image uploads
    let images = Array.isArray(post.images) ? post.images : [];
    if (req.files && req.files.length > 0) {
      // Delete old images if needed
      if (req.body.deleteOldImages === 'true') {
        try { await Media.deleteMany({ _id: { $in: images } }); } catch {}
        images = [];
      }
      
      // Save new images
      const newImages = await saveImages(req.files);
      images = [...images, ...newImages];
    }

    post.title = title ?? post.title;
    post.description = description ?? post.description;
    post.requirements = requirements ?? post.requirements;
    post.salary = salary ?? post.salary;
    post.location = location ?? post.location;
    post.job_type = job_type ?? post.job_type;
    post.images = images;
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

    // Delete associated images
    if (post.images && post.images.length) {
      try { await Media.deleteMany({ _id: { $in: post.images } }); } catch {}
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
    const posts = await Post.find({ user_id: userId }).sort({ created_at: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wall posts (exclude current user's own and liked posts)
exports.getWallPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 10 } = req.query;
    const numericPage = parseInt(page, 10) || 1;
    const numericLimit = parseInt(limit, 10) || 10;
    const skip = (numericPage - 1) * numericLimit;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const filter = {
      user_id: { $ne: userId },
      likedBy: { $ne: userId }
    };
    const [posts, count] = await Promise.all([
      Post.find(filter).sort({ created_at: -1 }).skip(skip).limit(numericLimit),
      Post.countDocuments(filter)
    ]);
    res.json({
      posts,
      totalPages: Math.ceil(count / numericLimit),
      currentPage: numericPage,
      totalPosts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};