const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  from_year: { type: Number, required: true },
  to_year: { type: Number }
}, {
  collection: 'experience',
  timestamps: false
});

const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience;
