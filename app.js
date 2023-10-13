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
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);


mongoose.connect('mongodb+srv://swiftytushar:oSISwXNAEFiVx0WF@cluster0.xqk2xot.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const io = new Server(httpServer, { 
  allowEIO3: true,
});

io.on("connection", (socket) => {
  console.log("User Connected.");
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  // new message
  socket.on("new message", (newMessageReceived) => {
    var chat = JSON.parse(newMessageReceived);
    //console.log(`Message recienved ${chat} ${chat["senderID"]}`)
    console.log(chat.receiverID); 
    io.emit(`${chat.receiverID} message recieved`,newMessageReceived);
    io.emit(`${chat.receiverID} chat updated`,newMessageReceived)

    //console.log(`Chat recieved ${chat[0]["senderID"]}`)
    // var chat = newMessageReceived.chat;

    // if (!chat.users) return console.log("chat.users not defined");

    // chat.users.forEach(user => {
    //   if (user._id == newMessageReceived.sender._id) return;

    //   socket.in(user._id).emit("message received", newMessageReceived);
    // });
    console.log("New message recieved")
  })
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
httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});
