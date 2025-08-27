const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');

// Configure multer for image upload to memory (we store in MongoDB)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

// Create a new post
router.post('/', upload.single('file'), postController.createPost);

// Get all posts (public)
router.get('/', postController.getAllPosts);

// Get wall posts (exclude current user's own and liked posts)
router.get('/wall/:userId', postController.getWallPosts);

// Get posts by user ID
router.get('/user/:userId', postController.getPostsByUserId);

// Get post by ID (public) - keep this last
router.get('/:id', postController.getPostById);

// Update post
router.put('/:id', upload.single('file'), postController.updatePost);

// Like/unlike a post
router.post('/:id/like', postController.likePost);

// Delete post
router.delete('/:id', postController.deletePost);

module.exports = router; 