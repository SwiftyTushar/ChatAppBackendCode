const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const config = require('./config');
const messageController = require('./controllers/messageController');
const User = require('./models/User');
const Message = require('./models/messageModel');
const Chat = require('./models/chatModel');
const userRoutes = require('./routes/userRoutes');

const app = express();

mongoose.connect('mongodb+srv://swiftytushar:oSISwXNAEFiVx0WF@cluster0.xqk2xot.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.post('/message/send-message', messageController.sendMessage);

// Define the API route to get user's chats
app.get('/chats/:userId', messageController.getUserChats);

// Define the API route to get user's messages
//app.get('messages/:userId', messageController.getUserMessages);

app.get('/chats/:chatID/messages', messageController.getMessagesByChatID);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
