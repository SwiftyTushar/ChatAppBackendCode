const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat', // Reference to the Chat model
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
