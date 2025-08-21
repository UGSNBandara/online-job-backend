const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  description: { type: String },
  skill: { type: [String], default: [] },
  year: { type: Number, required: true }
}, {
  collection: 'project',
  timestamps: false
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
