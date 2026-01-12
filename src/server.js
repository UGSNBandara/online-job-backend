

const express = require('express'); // Express web framework
const cors = require('cors'); // CORS middleware for cross-origin requests
const dotenv = require('dotenv'); 
const multer = require('multer');
const connectDatabase = require('./config/database');
const projectRoutes = require('./routes/projectRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const jobRoutes = require('./routes/jobRoutes');


dotenv.config();


const app = express();

connectDatabase();


app.use(cors()); 
app.use(express.json()); //this make access request as req.body like phrasing incoming jsons
// Parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));


app.use('/api/projects', projectRoutes);      // Project endpoints
app.use('/api/experiences', experienceRoutes); // Experience endpoints
app.use('/api/messages', messageRoutes);       // Messaging endpoints
app.use('/api/posts', postRoutes); // Post endpoints - multer moved to individual routes
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
      return res.status(400).json({ message: 'File size too large.' });
    }
    return res.status(400).json({ message: err.message });
  }
  // Handle all other errors
  res.status(500).json({ message: 'Something went wrong!' });
});


module.exports = app;


if (require.main === module) {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}