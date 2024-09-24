const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, allMessages } = require('../controllers/messageController');
const router = express.Router()

//protected means logged user can access this route
router.route('/').post(protect, sendMessage)

// fetch all msg for 1 single chat
router.route('/:chatId').get(protect, allMessages)

module.exports = router;