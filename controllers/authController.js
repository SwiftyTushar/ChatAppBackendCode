// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const config = require('../config');

async function signUp(req, res) {
    try {
      const { username, password, email } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success:false, message: 'Email is already in use' });
      }
      const chatArray = [];
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword ,email: email, chats:chatArray });
      await user.save();
  
      const token = jwt.sign({ userId: user._id }, config.secretKey, {
        expiresIn: config.expiresIn,
      });

      res.json({ success:true, message: "Authenticated successfully!",userId: user.id,token });
    } catch (error) {
      res.status(500).json({ success:false,message: 'Error signing up' });
    }
  }

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({success:false, message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({success:false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, config.secretKey, {
      expiresIn: config.expiresIn,
    });

    res.json({ success:true, message: "Logged in successfully!",userId: user.id ,token });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error logging in' });
  }
}

module.exports = { signUp, login };
