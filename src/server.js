
// Import required modules
const express = require('express'); // Express web framework
const cors = require('cors'); // CORS middleware for cross-origin requests
const dotenv = require('dotenv'); // Loads environment variables from .env file
const multer = require('multer'); // Middleware for handling file uploads
const connectDatabase = require('./config/database'); // MongoDB connection setup
// Import route modules for different resources
const projectRoutes = require('./routes/projectRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const jobRoutes = require('./routes/jobRoutes');


// Load environment variables from .env file
dotenv.config();


// Create Express app instance
const app = express();


// Configure multer for file uploads (images stored in MongoDB)
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Only allow JPEG, PNG, and GIF images
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});


// Connect to MongoDB using Mongoose
connectDatabase();


// Enable CORS for all routes
app.use(cors()); // Cross-Origin Resource Sharing
// Parse incoming JSON requests
app.use(express.json()); //this make access request as req.body like phrasing incoming jsons
// Parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));


// Static file serving removed; images are stored and served from MongoDB


// Register API routes for each resource
app.use('/api/projects', projectRoutes);      // Project endpoints
app.use('/api/experiences', experienceRoutes); // Experience endpoints
app.use('/api/messages', messageRoutes);       // Messaging endpoints
app.use('/api/posts', upload.single('image'), postRoutes); // Post endpoints (single image upload)
app.use('/api/users', userRoutes);             // User endpoints
app.use('/api/jobs', jobRoutes);               // Job endpoints
app.use('/api/media', mediaRoutes);            // Media/image endpoints


// Root endpoint for health check or welcome message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Online Job Portal API' });
});


// Error handling middleware for all routes
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack trace
  if (err instanceof multer.MulterError) {
    // Handle file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  // Handle all other errors
  res.status(500).json({ message: 'Something went wrong!' });
});


// Export the Express app for use in Vercel or other platforms
module.exports = app;


// Start server for local development only
if (require.main === module) {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}