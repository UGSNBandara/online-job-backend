const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  created_at: { type: Date, default: Date.now }
}, {
  collection: 'media',
  timestamps: false
});

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;


