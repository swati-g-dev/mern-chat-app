import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Image, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, chats, setChats, setSelectedChat, notification, setNotification } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-left",
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: "dark",
  };

  const logoutHandler = () => {
    localStorage.removeItem("chat-app-user");
    navigate("/");
  };

  // Function to format Multiavatar identifier into a URL
  // const getMultiavatarUrl = (identifier) => {
  //     return `https://www.multiavatar.com/${identifier}.svg`;
  // };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please Enter something in search", toastOptions);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results", toastOptions);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      //if usse phle se baat ho rhi to, it find in the list to update karega
      // checks if there is an existing chat in the chats array with the same _id
      // If no such chat is found, it is new chat, so it adds (data) to the beginning of chats array using setChats([data, ...chats]).
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      toast.error("Error fetching the chat");
    }
  }

  return (
    <>
      <Box
        display='flex'
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            {/* <i className="fas fa-search"></i> */}
            <i className="fa-solid fa-magnifying-glass"></i>
            {/* on small screen not diaplay text but in medium screen*/}
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Box display="flex" alignItems="center" position="absolute" left="50%" transform="translateX(-50%)">
          <Image display={{ base: "none", md: "flex" }} src="../../assets/logo/logo.png" alt="Logo" boxSize="6rem" ml={10} mr={5} />
          <p className="brand" data-text="ChatterBox">ChatterBox</p>
        </Box>
      
        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            /> */}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList> */}
          </Menu>
        
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                src={user.isAvatarImageSet ? `data:image/svg+xml;base64,${user.pic}` : user.pic}
                name={user.username}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
              {/* 
              <MenuItem>My Profile</MenuItem>{" "}
            
            */}
            </MenuList>
          </Menu>
        </div>
      </Box>
    
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer