const generateToken = require("../config/generateToken");
const User=require("../models/userModel");
const bcrypt = require('bcryptjs');

module.exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
        // return res.json({ msg: "Username already used", status: false });
        res.status(400);
        throw new Error("Username already used");
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        // return res.json({ msg: "Email already used", status: false });
        res.status(400);
        throw new Error("Email already used");
    }

    const user = await User.create({
        username, email, password
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    }
    else {
        res.status(400);
        throw new Error("Failed to Create the User")
    }
}

//  /api/user?search=swati
module.exports.getAllUsers = async (req, res) => {
  //if there is query then search user else nothing
  const keyword = req.query.search ? {
    $or: [
      { username: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ],
  } : {};
   // not equal to($ne) the current logged user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    // const users = await User.find({...keyword, _id: { $ne: req.user._id },});
  res.json(users);
}


module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const pic = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        pic,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.pic,
    });
  } catch (ex) {
    next(ex);
  }
}

module.exports.authUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username});
  if (user) {
    const passOk = bcrypt.compareSync(password, user.password);
    if (passOk) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        pic: user.pic,
        isAvatarImageSet: user.isAvatarImageSet,
        token: generateToken(user._id),
      });
    }
  } else {
    res.status(401);
    // throw new Error("Invalid Username or Password");
    return res.status(400).json({ message: "Username or Password INCORRECT" });

  }
}


// module.exports.logOut = (req, res, next) => {
//   try {
//     if (!req.params.id) return res.json({ msg: "User id is required " });
//     onlineUsers.delete(req.params.id);
//     return res.status(200).send();
//   } catch (ex) {
//     next(ex);
//   }
// };