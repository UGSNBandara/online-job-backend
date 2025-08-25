const User = require('../models/User');
const Media = require('../models/Media');

// Removed getCurrentUser due to no auth

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();
    const profileImageUrl = userObj.profileImage ? `/api/media/${userObj.profileImage}` : null;
    res.json({ ...userObj, profileImageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, title, location, description } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.title = title ?? user.title;
    user.location = location ?? user.location;
    user.description = description ?? user.description;
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Update user skills
exports.updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update skills
    user.skills = Array.isArray(skills) ? skills : [];
    await user.save();

    res.json({ message: 'Skills updated successfully', skills: user.skills });
  } catch (error) {
    res.status(500).json({ message: 'Error updating skills', error: error.message });
  }
};

// Update profile image
exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // If user has an existing profile image, delete the old media
    if (user.profileImage) {
      try { await Media.findByIdAndDelete(user.profileImage); } catch {}
    }

    // Save new image to MongoDB
    const media = await Media.create({ filename: req.file.originalname, contentType: req.file.mimetype, data: req.file.buffer });
    user.profileImage = media._id;
    await user.save();
    res.json({ message: 'Profile image updated successfully', profileImageUrl: `/api/media/${media._id}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile image', error: error.message });
  }
};

// User registration
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    const user = new User({ email, password, firstName, lastName, role });
  await user.save();
  const userObj = user.toObject();
  delete userObj.password;
  res.status(201).json({ message: 'User registered successfully.', user: userObj });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // For demo: return user info (no JWT)
    const userObj = user.toObject();
    delete userObj.password;
    res.json({ message: 'Login successful', user: userObj });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};