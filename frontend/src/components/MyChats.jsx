import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { Avatar, Box, Button, Stack, Text, background } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getColor, getSender, getSenderFull } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { color } from 'framer-motion';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toastOptions = {
    position: "bottom-left",
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: "dark",
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast.error("Failed to Load the chats", toastOptions);

    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("chat-app-user")));
    fetchChats();
  }, [fetchAgain]);


  return (
    <>
      <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      >
      {/* //padding bottom and px is hori */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work Sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
          alignItems="center"
      >
          My Chats
          {/* <Box ml="auto"> */}
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
          {/* </Box> */}
          </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
            <Stack overflowY="scroll"
              // sx={{
              //   '-webkit-scrollbar': { width: "0.2rem" }, 
              //   '-webkit-scrollbar-thumb': {
              //     backgroundColor: 'red', 
              //     width:'0.1rem',
              //     borderRadius: '1rem' 
              //   }
              // }}
              >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                display={'flex'}
                borderRadius="lg"
                key={chat._id}
              >
              {chat.isGroupChat ? (
                  <Avatar
                    mr={2}
                    size="sm"
                    name={chat.chatName}
                    bg={getColor(chat.chatName)}
                    color="white"
                  />
                ) : (
                    <Avatar
                      mr={2}
                      size="sm"
                      name={getSender(loggedUser, chat.users)}
                      src={getSenderFull(loggedUser, chat.users).isAvatarImageSet ? `data:image/svg+xml;base64,${getSenderFull(loggedUser, chat.users).pic}` : getSenderFull(loggedUser, chat.users).pic}
                    />
                  )}
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {/* {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )} */}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
    </>


  )
}

export default MyChats