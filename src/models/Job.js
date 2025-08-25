const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true
  },
  salaryRange: { type: String },
  description: { type: String },
  requirements: { type: [String], default: [] },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  collection: 'jobs',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
