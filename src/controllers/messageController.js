const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

const messageController = {
  // Create a new message
  createMessage: async (req, res) => {
    try {
      const { sender_id, receiver_id, message_text } = req.body;
      const message = await Message.create({
        sender_id,
        receiver_id,
        message_text
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all messages for a user
  getUserMessages: async (req, res) => {
    try {
      const userId = req.params.userId;
      const messages = await Message.find({
        $or: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      })
      .populate('sender_id', 'firstName lastName profileImage role')
      .populate('receiver_id', 'firstName lastName profileImage role')
      .sort({ created_at: -1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get conversation between two users
  getConversation: async (req, res) => {
    try {
      const { userId1, userId2 } = req.params;
      const messages = await Message.find({
        $or: [
          { sender_id: userId1, receiver_id: userId2 },
          { sender_id: userId2, receiver_id: userId1 }
        ]
      })
      .populate('sender_id', 'firstName lastName profileImage role')
      .populate('receiver_id', 'firstName lastName profileImage role')
      .sort({ created_at: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  
};

module.exports = messageController;