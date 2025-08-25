const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Create a new post
router.post('/', postController.createPost);

// Get all posts (public)

// Get wall posts (exclude current user's own and liked posts)
router.get('/wall/:userId', postController.getWallPosts);

// Get posts by user ID
router.get('/user/:userId', postController.getPostsByUserId);

router.get('/', postController.getAllPosts);

// Get post by ID (public) - keep this last
router.get('/:id', postController.getPostById);

// Update post
router.put('/:id', postController.updatePost);


// Like/unlike a post
router.post('/:id/like', postController.likePost);

// Get posts by user ID
router.get('/user/:userId', postController.getPostsByUserId);

// Get wall posts (exclude current user's own and liked posts)
router.get('/wall', postController.getWallPosts);

// Delete post
router.delete('/:id', postController.deletePost);

module.exports = router; 