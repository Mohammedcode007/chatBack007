// routers/messageRouter.js

const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/ConversationController');

router.get('/conversation', conversationController.getAllConversations);
router.post('/delete_conversation', conversationController.deleteConversation);


module.exports = router;
