const mongoose = require('mongoose')

const chatModel = mongoose.Schema({
    //defining object
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    //array of user
    users: [
        {
            //contain id to that parti user
            type: mongoose.Schema.Types.ObjectId,
            //ref to user model
            ref: "User",
        },
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});
//field so that mongoose create a timestamp ehnw we create new data
chatModel.set('timestamps', true);


//creatung model and exporting
const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;