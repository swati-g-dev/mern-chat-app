import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        const chatUser = JSON.parse(localStorage.getItem("chat-app-user"));
        setUser(chatUser);

        if (!chatUser)
            navigate("/");
    }, [navigate]);

    return (
        <ChatContext.Provider
            value={{
                user, setUser,
                selectedChat, setSelectedChat,
                notification, setNotification,
                chats, setChats
            }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

// export default ChatProvider;