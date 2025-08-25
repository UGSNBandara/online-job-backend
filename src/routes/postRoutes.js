const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');


// Create a new post
router.post('/', postController.createPost);

// ...existing code...

// Get wall posts (exclude current user's own and liked posts)
router.get('/wall/:userId', postController.getWallPosts);

// Get posts by user ID
router.get('/user/:userId', postController.getPostsByUserId);

// ...existing code...

// Update post
router.put('/:id', postController.updatePost);

// Like/unlike a post
router.post('/:id/like', postController.likePost);

// Delete post
router.delete('/:id', postController.deletePost);

module.exports = router; 