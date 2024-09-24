export const getSender = (loggedUser, users) => {
    if (users && users.length >= 2) {

  return users[0]?._id === loggedUser?._id ? users[1].username : users[0].username;
}
  return "Unknown Sender";
  };

export const getSenderFull = (loggedUser, users) => {
if (users && users.length >= 2) {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  }
  return null;
};

export const getColor = (name) => {
  const colors = ['red.500', 'green.500', 'blue.500', 'orange.500', 'purple.500', 'teal.500'];
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// all msg, currentmsg, index of currentmsg, logged user id
export const isSameSender = (messages, m, i, userId) => {
  return (
    // Check if there are more messages after the current one
    // next msg from me or not there
    // if current msg is not from logged user

    // then only we display profile
        
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// check if it's last msg of opp user
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    // Ensure the sender ID is defined
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    // Add a margin if the next message is from the same sender and not from the logged-in user
    return 36;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    // No margin if the sender changes or it's the last message and not from the logged-in user
    return 0;

    // goes in right
  else return "auto";
};

// checks if the current message is from the same sender as the previous message.
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
