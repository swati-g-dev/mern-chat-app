//importing libraries
const express = require("express");
const dotenv = require("dotenv");
// const { chats } = require("./data/data");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
//create instance of express variable
const app = express();
//using app we can start urn own server

app.use(express.json());  //to accept JSON data

//connect to db
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connection Successful");
        // console.log(`MongoDB Connected: ${connection.host}`);
    })
    .catch((error) => {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    });  


//get is http req, when visit / means gonna do smthng
app.get('/', (req, res) => { 
    res.send("API is Running Successfully");
});

app.use('/api/user', userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

app.use(notFound)
app.use(errorHandler)



// //creating api with express
// app.get('/api/chat', (req, res) => {
//     res.send(chats);
// });

// //single chat data using id
// //finding single chat with this id
// app.get('/api/chat/:id', (req, res) => {
//     // console.log(req.params.id);
//     const singleChat = chats.find(c => c._id === req.params.id);
//     res.send(singleChat);
// })

const PORT = process.env.PORT || 5000;
//don't want it to be public that its 5000 so create env file
const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    // create a room with user data id
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  // socket.on("typing", (room) => socket.in(room).emit("typing"));
  // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
socket.on("typing", (chatId, userId) => {
  socket.to(chatId).emit("typing", { userId });
});

socket.on("stop typing", (chatId, userId) => {
  socket.to(chatId).emit("stop typing", { userId });
});

socket.on("new message", (newMessageRecieved) => {
  var chat = newMessageRecieved.chat;
  if (!chat.users) return console.log("chat.users not defined");
  chat.users.forEach((user) => {
  // send msg to users other than me
    if (user._id == newMessageRecieved.sender._id) return;
    socket.in(user._id).emit("message received", newMessageRecieved);
  });
});

//   socket.off("setup", () => {
//       console.log("USER DISCONNECTED");
//       socket.leave(userData._id);
//   });
})