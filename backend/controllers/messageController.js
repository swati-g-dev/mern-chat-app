const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

module.exports.sendMessage = async (req, res) => {
    const { text, file, chatId } = req.body;

    if (chatId && (text || file)) {
        var newMessage = {
            sender: req.user._id,
            text: text,
            chat: chatId,
        };
        try {
            var message = await Message.create(newMessage);
            message = await message.populate("sender", "username pic isAvatarImageSet");
            message = await message.populate("chat");
            //since each chat has a grp of users
            message = await User.populate(message, {
              path: "chat.users",
              select: "username pic isAvatarImageSet email",
            });
        
            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        
            res.json(message);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
    else {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
}

module.exports.allMessages = async (req, res, next) => {
    try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username pic isAvatarImageSet email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}      