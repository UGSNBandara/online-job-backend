const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String },
  images: { type: [mongoose.Schema.Types.ObjectId], ref: 'Media', default: [] },
  requirements: { type: String },
  salary: { type: String },
  location: { type: String },
  job_type: { type: String },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  collection: 'posts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
