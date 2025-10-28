import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import Robot from "../../assets/robot.gif"
import { Box, FormControl, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from 'styled-components';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import EmojiPicker from 'emoji-picker-react';
import { IoMdSend } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const toastOptions = {
    position: "bottom-left",
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: "dark",
  };

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    // let msg = newMessage;
    // msg += emojiObject.emoji;
    // setNewMessage(msg);
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);

  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post("/api/message",
          {
            text: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        // show this msg to all
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Failed to send the Message", toastOptions);
      }
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
    socket.on("typing", (data) => {
    if (data.userId !== user._id) {
      setIsTyping(true);
    }
    });
    socket.on("stop typing", (data) => {
      if (data.userId !== user._id) {
        setIsTyping(false);
      }
    });
    
    return () => {
    socket.off("typing");
    socket.off("stop typing");
  };
}, [user._id]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
       // if chat is not selected or doesn't match current chat
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // if (!notification.includes(newMessageReceived)) {
        //   setNotification([newMessageReceived, ...notification]);
        //   setFetchAgain(!fetchAgain);
        // }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to Load the Messages", toastOptions);
    }
  };


  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    // fro 3 sec typing indicator remain active after the user stops typing.
    var timerLength = 3000;

    //  set timeout create a delay of 3 seconds.
    setTimeout(() => {
      var timeNow = new Date().getTime();
      // time that has elapsed since the last keystroke.
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }
  

    return (
      <>
      {selectedChat ? (
        <>
           <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work Sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            // justifyContent={{ base: "center", md: "space-between" }}

              alignItems="center"
              // position={"relative"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                // position={{ base: "absolute", md: "relative" }}
                // left={{ base: "10px", md: "0" }}

                // position={"absolute"}
    // left="0"
              
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                    {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
                  <Box className="messages"
                    display="flex"
                    flexDir="column"
                    overflowY="scroll"
                  >
                <ScrollableChat messages={messages} />
              </Box>
            )}

              {/* onkeydown means on pressing enter */}
            <InputContainer>
            <FormControl
              as="form"
              onSubmit={sendMessage}
              id="message-form"
              isRequired
              mt={3}
                >
              <div className="input-wrapper">
                  <div className="emoji">
                      <MdEmojiEmotions onClick={handleEmojiPickerHideShow} />
                      {showEmojiPicker && <EmojiPicker className="emoji-picker-react" onEmojiClick={handleEmojiClick}/>}
                  </div>
              {istyping ? (
                      <div>
                        Loading...
                {/* <Lottie
                options={defaultOptions}
                // height={50}
                width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  /> */}
                </div> 
              ) : (
                <></>
              )}
              <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message.."
                    value={newMessage}
                    onChange={typingHandler}
                      
                      flex={1}
                      border={"none"}
                      borderRadius={"2rem"}
                      // background={"none"}
                      pr={"3rem"}
                      // outline={"none"}
                  />
                  <button type="submit" className="submit">
                    <IoMdSend />
                  </button>
                </div>
              </FormControl>
            </InputContainer>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{user.username}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
      )}
    </>  )
}

const Container = styled.div`
background-color: #2B3A67;
  // 1e1e2f 131324 8d6b94  827191 aa78a6 646e78 7d6b91
  // background-color: #1e1e2f; /* A complementary dark color */
  // background-image: linear-gradient(45deg, #1e1e2f 25%, #27293d 75%);
  background-size: cover;


  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height:100%;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #aa78a6;
    // 1e1e2f 131324 8d6b94  827191 aa78a6 646e78 7d6b91
  // background-color: #1e1e2f; /* A complementary dark color */
  // background-image: linear-gradient(45deg, #1e1e2f 25%, #27293d 75%);
  }
`;

const InputContainer = styled.div`
position: relative;

  .input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;

    .emoji {
      // display: flex;
      // align-items: center;
      margin-right: 0.5rem;

      position:relative;
      svg {
        font-size: 1.8rem;
        color: #ffd225;
        cursor: pointer;
      }
    }
        
    .emoji-picker-react {

      position: absolute;
      bottom: 45px;
      z-index: 1000;
      transform: scale(0.8); 
  transform-origin: bottom left;
      // background-color: #080420;
      box-shadow: 0 5px 10px #9a86f3;
      border-color: #9a86f3;
      // .emoji-scroll-wrapper::-webkit-scrollbar {
      //   background-color: #080420;
      //   width: 5px;

      //   &-thumb {
      //     background-color: #9a86f3;
      //   }
      // }

      // .emoji-categories {
      //   button {
      //     filter: contrast(0);
      //   }
      }
      // .emoji-search {
      //   // background-color: transparent;
      //   // border-color: #9a86f3;
      // }
      // .emoji-group:before {
      //   // background-color: #080420;
      // }
    }
  }

  .submit {
    position: absolute;
    right: 0.2rem;

    padding: 0.3rem 2rem;

    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #9a86f3;
    border: none;
      margin-left: 1rem;
      svg {
        font-size: 1.5rem;
        color: white;
      }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      padding: 0.3rem 1rem;
      svg {
        font-size: 1rem;
      }
    }
  }
`;


export default SingleChat