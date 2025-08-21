const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');

// Configure multer for image upload to memory (we store in MongoDB)
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user profile by ID
router.put('/:id', userController.updateProfile);

// Update user skills by ID
router.put('/:id/skills', userController.updateSkills);

// Upload profile image by user ID
router.post('/:id/profile-image', upload.single('profileImage'), userController.updateProfileImage);

// User registration
router.post('/register', userController.register);

// User login
router.post('/login', userController.login);

module.exports = router; 