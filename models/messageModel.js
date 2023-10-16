const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the sender
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the recipient
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isMessageRead: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Message', messageSchema);
