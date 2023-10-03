const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Search for users based on criteria
router.get('/users/search', userController.searchUsers);

module.exports = router;
