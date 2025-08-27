const Job = require('../models/Job');

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, jobType, salaryRange, description, requirements, user_id } = req.body;
    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      salaryRange,
      description,
      requirements,
      user_id
    });
    res.status(201).json(job); // Created
  } catch (error) {
    res.status(400).json({ message: error.message }); // Bad Request
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ created_at: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Internal Server Error
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const { title, company, location, jobType, salaryRange, description, requirements } = req.body;
    job.title = title ?? job.title;
    job.company = company ?? job.company;
    job.location = location ?? job.location;
    job.jobType = jobType ?? job.jobType;
    job.salaryRange = salaryRange ?? job.salaryRange;
    job.description = description ?? job.description;
    job.requirements = requirements ?? job.requirements;
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
