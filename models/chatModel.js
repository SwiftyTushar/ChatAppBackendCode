const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message', // Reference to the Message model
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message', // Reference to the latest Message model
  },
});

module.exports = mongoose.model('Chat', chatSchema);
