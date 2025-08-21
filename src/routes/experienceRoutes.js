const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');

// Create a new experience
router.post('/', experienceController.createExperience);

// Get all experiences
router.get('/', experienceController.getAllExperiences);

// Get experience by ID
router.get('/:id', experienceController.getExperienceById);

// Update experience
router.put('/:id', experienceController.updateExperience);

// Delete experience
router.delete('/:id', experienceController.deleteExperience);

module.exports = router; 