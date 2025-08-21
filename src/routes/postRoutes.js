const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Create a new post
router.post('/', postController.createPost);

// Get all posts (public)
router.get('/', postController.getAllPosts);

// Get post by ID (public)
router.get('/:id', postController.getPostById);

// Update post
router.put('/:id', postController.updatePost);

// Delete post
router.delete('/:id', postController.deletePost);

module.exports = router; 