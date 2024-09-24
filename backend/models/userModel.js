const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: { type: "String", unique: true, min: 3, max: 20, required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true, min: 8 },
    pic: {
        type: "String",
        default:
        "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
    },
    isAvatarImageSet: { type: Boolean, default: false },
    // isAdmin: { type: Boolean, required: true, default: false }
});
userSchema.set('timestamps', true);

userSchema.pre('save',async function (next) {
    if (!this.isModified) {
        next();
    }
    //higher no more strong salt is generated
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);

module.exports = User;