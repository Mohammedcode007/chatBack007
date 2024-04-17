const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User"); // استيراد نموذج المستخدم

exports.getAllConversations = async (req, res) => {
    const { userId } = req.query;

    try {
        // العثور على المحادثات التي يكون المستخدم مشاركًا فيها
        const conversations = await Conversation.find({ participants: userId })
            .populate({
                path: 'messages',
                model: 'Message'
            })
            .populate({
                path: 'lastMessage',
                model: 'Message'
            })
            .populate({
                path: 'participants',
                model: 'User',
                // تحديد الشرط بناءً على معرف المستخدم
                match: { _id: { $ne: userId } } // لا يساوي userId
            });

        // جلب حالة المشاركين وتضمينها في كل محادثة
        for (const conversation of conversations) {
            for (const participant of conversation.participants) {
                const user = await User.findById(participant._id);
                participant.status = user.status; // افتراض أن حالة المستخدم مخزنة في حقل يسمى "status"
            }
        }

        res.status(200).json({ conversations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteConversation = async (req, res) => {
    const conversationId = req.query.id; // Assuming the conversation ID is provided in the request parameters

    try {
        // Find the conversation by ID
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Delete all associated messages
        await Message.deleteMany({ conversation: conversationId });

        // Delete the conversation itself
        await Conversation.deleteOne({ _id: conversationId });

        res.json({ message: 'Conversation deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

