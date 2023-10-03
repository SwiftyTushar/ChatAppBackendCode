const User = require('../models/User');

async function searchUsers(req, res) {
    try {
      const { query } = req.query;
  
      // Use a regular expression to perform case-insensitive search on username or other attributes
      const users = await User.find({
        $or: [
          { username: { $regex: new RegExp(query, 'i') } },
          { email: { $regex: new RegExp(query, 'i') } },
          // Add more fields as needed for your search criteria
        ],
      });
  
      res.json({ users });
    } catch (error) {
      console.error('Error searching for users:', error);
      res.status(500).json({ error: 'Error searching for users' });
    }
  }
  
  module.exports = {
    searchUsers,
  };