const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
module.exports.accessChat = async (req, res,next) => {
    const { userId } = req.body;
    // curent logged user searching gor some id
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    try {
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                //my id and next requestedid se element maatch
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
        .populate("users", "-password")
        .populate("latestMessage");
  
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "username pic isAvatarImageSet email",
        });

        // ischat a rray me 1 hi result rhega tb bhi tkae [0]
        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };
        
            const createdChat = await Chat.create(chatData);
            //send to user
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users","-password");
            res.status(200).json(FullChat);
        }
    } catch (error) {
        next(error);
    }
}  

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
module.exports.fetchChats = async (req, res,next) => {
    try {
        const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "username pic isAvatarImageSet email",
        });

        res.status(200).send(populatedResults);
    } catch (error) {
        next(error);
    }
}

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
module.exports.createGroupChat = async (req, res,next) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    try {
        //take array of user and pasrse in string
        const users = JSON.parse(req.body.users);
        if (users.length < 2) {
            return res.status(400).send("More than 2 users are required to form a group chat");
        }
        //add current user as well in grp
        users.push(req.user);
    
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch (error) {
        next(error);
    }
}

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
module.exports.renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName: chatName },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
}

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
module.exports.addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin
    const added = await Chat.findByIdAndUpdate(
        chatId, { $push: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
}

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
module.exports.removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin
    const removed = await Chat.findByIdAndUpdate(
        chatId, { $pull: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
}
