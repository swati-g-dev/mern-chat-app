import { Avatar, Tooltip } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider';
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';

const ScrollableChat = ({ messages }) => { 
    const { user } = ChatState();
    // const scrollRef = useRef();
    
    // useEffect(() => {
    //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);
    
    return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id} >
              {/* parameter are all msg, currentmsg index of currentmsg looged userid */}
              {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.username} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.username}
                  src={m.sender.isAvatarImageSet ? `data:image/svg+xml;base64,${m.sender.pic}` : m.sender.pic}
                />
              </Tooltip>
                  )}
              <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#b7d9fb" : "#64cec9"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat