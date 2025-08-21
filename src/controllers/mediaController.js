const Media = require('../models/Media');

exports.streamMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.set('Content-Type', media.contentType);
    res.send(media.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching file', error: error.message });
  }
};


