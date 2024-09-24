import React, { useEffect, useState } from 'react'
import { Container,Box,Tabs,TabList,Tab,TabPanels,TabPanel, Image} from "@chakra-ui/react";
import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';
import styled, { keyframes } from 'styled-components';
import '../HomePage.css'  
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("chat-app-user"));
      setUser(user);
      if (user)
          navigate("/chat");
    }, [navigate]); 

  const [tabIndex, setTabIndex] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Container maxW='xl' centerContent>
      {/* <div className="brand">
          <img src="../../assets/logo/OIG3.png" alt="Logo" />
          <h1>ChatterBox</h1>
      </div> */}

      {/* Branding Section */}
      <Box
        display='flex'
        // textAlign="center"
        alignItems={"center"}
        p={2}
        bg={"white"}
        w="100%"
        // m="40px 0 15px 0"
        m="25px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        // overflow={"hidden"}
        // justifyContent={"center"}
      >
        <Image src="../../assets/logo/logo.png" alt="Logo" boxSize="6rem" ml={10} mr={5}/>
        <p className="brand" data-text="ChatterBox">ChatterBox</p>
        {/* <Text fontSize="4xl" fontFamily='Work Sans'>
          ChatterBox
        </Text> */}
      </Box>

      {/* Tabs Section */}
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" mb="25px">
        <Tabs variant='soft-rounded' index={tabIndex} onChange={(index) => setTabIndex(index)}>
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><Login setTabIndex={setTabIndex} /></TabPanel>
            <TabPanel><SignUp setTabIndex={setTabIndex} /></TabPanel>
          </TabPanels>
        </Tabs>

      </Box>
    </Container>
  )
}

// const typing = keyframes`
//   100% {
//     left:100%;
//     margin: 0 -35px 0 35px;
//   }
// `;
// const Text = styled.p`
//   font-family: 'Work Sans';
//   font-size: 2.25rem;
//   position: relative;
//   overflow: hidden;

//   &::after {
//     content: "";
//     position: absolute;
//     border-left: 2px solid black;
//     left: 0;
//     height: 100%;
//     width: 100%;
//     animation: ${typing} 1.5s steps(10) infinite;
//     background-color: white;
// }
// `;


export default HomePage

// export default function Home() {
//   return (
//     <h1>hOme</h1>
//   )
// }




// import { useEffect } from "react";
// // import { useHistory } from "react-router";

// function Homepage() {
//   // const history = useHistory();
//   // useEffect(() => {
//   //   const user = JSON.parse(localStorage.getItem("userInfo"));
//   //   if (user) history.push("/chats");
//   // }, [history]);

//   return (
    
      
//         <Tabs isFitted variant="soft-rounded">
//           <TabList mb="1em">
//             <Tab>Login</Tab>
//             <Tab>Sign Up</Tab>
//           </TabList>
//         </Tabs>
//       </Box>
//     </Container>
//   );
// }