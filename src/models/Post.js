const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String }, // URL path to the image
  images: { type: [String], default: [] }, // Array of image URLs
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likeCount: { type: Number, default: 0 },
  likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }
}, {
  collection: 'posts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;