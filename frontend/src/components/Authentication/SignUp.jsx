import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Link,Text,VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'


const SignUp = ({ setTabIndex }) => {
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [show, setShow] = useState(false)
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: "dark",
  };

  const handleClick = () => setShow(!show);
  const submitHandler = async () => {
    if (!username || !email || !password || !confirmPassword) {
      toast.warning("Please fill all the fields", toastOptions);
      return;
    } else if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.", toastOptions);
      return;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.",toastOptions);
      return;
    } else if (password.length < 8) {
      toast.error("Password should be equal or greater than 8 characters.",toastOptions);
      return;
    } 

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post("/api/user",
        { username, email, password }, config
      );

      toast.success("Account created", toastOptions);
      localStorage.setItem("chat-app-user", JSON.stringify(data));
      navigate("/setAvatar");
    } catch (error) {
      toast.error("Error Occurred",toastOptions)
    }
  };

  return (
    <VStack spacing='5px'>
      <FormControl id='username' isRequired>
        <FormLabel>Username</FormLabel>
        <Input placeholder='Enter the username'
        onChange={(e)=>setUsername(e.target.value)}></Input>
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your email'
        onChange={(e)=>setEmail(e.target.value)}></Input>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input type={show?"text":'password'} placeholder='Enter your password'
          onChange={(e) => setPassword(e.target.value)}>
          </Input>
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='confirmPassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input type={show?"text":'password'} placeholder='Confirm password'
          onChange={(e) => setConfirmPassword(e.target.value)}>
          </Input>
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
        Sign Up
      </Button>
      <Text>Already have an account ?{' '} <Link onClick={() => setTabIndex(0)}>Login</Link></Text>
    
    </VStack>
  )
}

export default SignUp