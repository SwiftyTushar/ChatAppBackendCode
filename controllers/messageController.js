const Message = require('../models/messageModel');
const User = require('../models/User');
const Chat = require('../models/chatModel');


// Function to send a message to a specific user
async function sendMessage(req, res) {
  try {
    const { senderId, recipientId, text } = req.body;
    console.log(`HELqwejrqweorjqwo`);
    // Check if the sender and recipient exist
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ error: 'Sender or recipient not found' });
    }

    // Find or create a chat between sender and recipient
    let chat = await Chat.findOne({
      users: { $all: [senderId, recipientId] },
    });
    console.log(`MODELS---- ${senderId} recep ${recipientId}`);
    if (!chat) {
      chat = new Chat({ users: [senderId, recipientId], messages: [] });
      chat.lastMessageTime = Date.now();
      await chat.save();
    }

    // Create a new message
    const message = new Message({
      text,
      sender: senderId,
      recipient: recipientId,
    });

    await message.save();

    // Update the chat's messages and latestMessage
    chat.messages.push(message);
    chat.latestMessage = message._id;
    chat.lastText = text;
    chat.lastMessageTime = Date.now();
    chat.isLatestMessageRead = false;
    chat.lastMessageSentBy = senderId;
    await chat.save();

    // Update the User models with the chat information
    sender.chats.addToSet(chat._id);
    recipient.chats.addToSet(chat._id);
    await sender.save();
    await recipient.save();

    // Return a success response
    res.status(201).json({ message: 'Message sent successfully',chatID:chat.id});
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
}

// Function to get user's chats
async function getUserChats(req, res) {
  try {
    const userId = req.params.userId; // Assuming you pass the user's ID as a route parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve the user's chats
    const userChats = await Chat.find({ users: userId }).populate('users', 'username'); // Populate the usernames of the chat participants
    res.json({ userChats });
  } catch (error) {
    console.error('Error retrieving user chats:', error);
    res.status(500).json({ error: 'Error retrieving user chats' });
  }
}

// Function to get user's messages
async function getUserMessages(req, res) {
  try {
    const userId = req.params.userId; // Assuming you pass the user's ID as a route parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve the user's messages
    const userMessages = await Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
      .sort({ timestamp: -1 }) // Sort messages by timestamp in descending order
      .populate('sender', 'username') // Populate the sender's username
      .populate('recipient', 'username'); // Populate the recipient's username

    res.json({ userMessages });
  } catch (error) {
    console.error('Error retrieving user messages:', error);
    res.status(500).json({ error: 'Error retrieving user messages' });
  }
}

async function fetchMessagesByChatID(req,res) {
  try{
    const chatID = req.body.chatID;
    const currentUserID = req.body.currentUserID;
    const recipientId = req.body.recipientId;
    console.log(`REQUEEST------- ${chatID}`);
    const chat = await Chat.findById(chatID);

    if(!chat){
      return res.status(404)
    }
    const messages = await Message.find({ _id: { $in: chat.messages } })
    .sort({ timestamp: 1 }) // Sort messages by timestamp in ascending order
    .populate('sender', 'username') // Populate the sender's username
    .populate('recipient', 'username'); 
    console.log("Hello World!!!");
    let lastMSG = messages[messages.length - 1];
    console.log(`GOT THE DATA---- ${lastMSG} chat ${chat}`)
    if (lastMSG.sender._id == recipientId && lastMSG.isMessageRead == false){
      lastMSG.isMessageRead = true
      chat.isLatestMessageRead = true
      await lastMSG.save();
      await chat.save();
      console.log(`I am here`);
    }
    // for(const message of messages){
    //   if(message.sender == recipientId && message.isMessageRead == false){
    //     const msgID = message.id;
    //     console.log(`Messages Data ID: ${msgID}`);
    //     await Chat.findByIdAndUpdate(chatID, {isLatestMessageRead: true});
    //     await Message.findByIdAndUpdate(msgID, { isLatestMessageRead: true });
    //   }
    // }
    console.log(`After the messages`)
    res.json({messages})
  } catch(error){
    console.error('Error retrieving chat messages:', error);
    res.status(500).json({ error: 'Error retrieving chat messages' });
  }
}

async function getMessagesByChatID(req, res) {
  try {
    const chatID = req.params.chatID; // Assuming you pass the chat's ID as a route parameter

    // Find the chat by ID
    const chat = await Chat.findById(chatID);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Retrieve messages for the chat
    const messages = await Message.find({ _id: { $in: chat.messages } })
      .sort({ timestamp: 1 }) // Sort messages by timestamp in ascending order
      .populate('sender', 'username') // Populate the sender's username
      .populate('recipient', 'username'); // Populate the recipient's username

    res.json({ messages });
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    res.status(500).json({ error: 'Error retrieving chat messages' });
  }
}
module.exports = { sendMessage, getUserChats, getUserMessages,getMessagesByChatID,fetchMessagesByChatID};



