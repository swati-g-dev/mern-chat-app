import { ViewIcon } from '@chakra-ui/icons';
import {  Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const handleSetAvatar = () => {
      navigate("/setAvatar");
    };

    return (
        <>
            {/* profile modal tag k andar kuch likha ho.. as in upr vale me my profile.. then show it,
             other plaaces pe jha tag k anda rkuch nhi vha eye icon */}
            
            {children ?
                (<span onClick={onOpen}>{children}</span>)
                : (<IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />)
            }

            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    {/* <StyledModalContent  h="410px"> */}
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work Sans"
                        display="flex"
                        justifyContent="center"
                    // color="white"
                    >
                        {user.username}
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="space-between"
                    // color="white"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={user.isAvatarImageSet ? `data:image/svg+xml;base64,${user.pic}` : user.pic}
                            alt={user.username}
                        />
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily="Work Sans"
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>
      
                    <ModalFooter>
                        {children && (
                            <Button colorScheme='teal' mr={3} onClick={handleSetAvatar}>
                                Set Avatar
                            </Button>
                        )}
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        {/* <StyledButton onClick={onClose}>Close</StyledButton> */}
                    </ModalFooter>
                </ModalContent>
                {/* </StyledModalContent> */}
            </Modal>

            {/* 
                <Button onClick={onClose}>Close</Button>
             */}
            

        </>
    );            
};

// const StyledModalContent = styled(ModalContent)`
//   background-color: #131324;
// `;
// const StyledButton = styled.button`
//     background-color: #997af0;
//     color: white;
//     padding: 1rem 2rem;
//     border: none;
//     font-weight: bold;
//     cursor: pointer;
//     border-radius: 0.4rem;
//     font-size: 1rem;
//     text-transform: uppercase;
//     transition: 0.5s ease-in-out;
//     &:hover {
//         background-color: #4e0eff;
//     }
// `;

export default ProfileModal