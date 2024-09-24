const mongoose = require('mongoose')

const messageModel = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, trim: true },
    file: String,
    // readBy: [{ type: mongoose.Schema.Types.ObjectId,
    //        ref: "User" }],

    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
});
messageModel.set('timestamps', true);


const Message = mongoose.model("Message", messageModel);
module.exports = Message;