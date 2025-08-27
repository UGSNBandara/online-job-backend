const Experience = require('../models/Experience');

// Create a new experience
exports.createExperience = async (req, res) => {
  try {
    const { user_id, title, description, from_year, to_year } = req.body;
    const experience = await Experience.create({ user_id, title, description, from_year, to_year });
    res.status(201).json(experience); //created
  } catch (error) {
    res.status(400).json({ message: error.message }); //bad request
  }
};

// Get all experiences
exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.status(200).json(experiences); // OK
  } catch (error) {
    res.status(500).json({ message: error.message }); //internal server error
  }
};  

// Get experience by ID
exports.getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' }); // not found
    }
    res.status(200).json(experience); // OK
  } catch (error) {
    res.status(500).json({ message: error.message }); // internal server error
  }
};

// Update experience
exports.updateExperience = async (req, res) => {
  try {
    const { title, description, from_year, to_year } = req.body;
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' }); // not found
    }
    experience.title = title ?? experience.title;
    experience.description = description ?? experience.description;
    experience.from_year = from_year ?? experience.from_year;
    experience.to_year = to_year ?? experience.to_year;
    await experience.save();
    res.status(200).json(experience); // OK
  } catch (error) {
    res.status(400).json({ message: error.message }); // bad request
  }
};

// Delete experience
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' }); // not found
    }
    await experience.deleteOne();
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message }); // internal server error
  }
}; 