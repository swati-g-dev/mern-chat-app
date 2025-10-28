const express = require('express');
const { registerUser, setAvatar, authUser, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


//register user id the controller or the logic for it
//endpoint is after /api/user as given in server.js file
//will go to protect middleware before going to getalluser req
router.route('/').post(registerUser).get(protect,getAllUsers)
router.post('/login', authUser)

router.put("/setAvatar/:id", setAvatar);
// router.get("/logout/:id", logOut);



module.exports = router;