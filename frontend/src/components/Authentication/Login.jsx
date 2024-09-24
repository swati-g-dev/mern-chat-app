import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Link, Text , VStack } from '@chakra-ui/react'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setTabIndex }) => {
  const [show, setShow] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: "dark",
  };
  
  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleClick = () => setShow(!show);

  const submitHandler = async () => { 
    if (!username || !password) {
      toast.warning("Please fill all the fields", toastOptions);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post("/api/user/login",
        { username, password }, config
      );

      toast.success("Login Successful", toastOptions);
      localStorage.setItem("chat-app-user", JSON.stringify(data));
      navigate("/chat");
    } catch (error) {
      toast.error("Error Occurred", toastOptions);
    }
  };
  
  return (
    <VStack spacing='5px'>
      <FormControl id='username' isRequired>
        <FormLabel>Username</FormLabel>
        <Input 
          placeholder='Enter your username' 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input 
            type={show ? "text" : 'password'} 
            placeholder='Enter your password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme='blue'
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>
      
      <Button
        variant="solid"
        colorScheme='red'
        width="100%"
        onClick={() => {
          setUsername("Guest User");
          setPassword("12345678");
        }}
      >
        Get Guest User Credentials
      </Button>
      
      <Text>Don't have an account?{' '}<Link onClick={() => setTabIndex(1)}>Sign Up</Link></Text>
      
    </VStack>
  );
}

export default Login;
