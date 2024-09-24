import React, { useEffect, useState } from 'react'
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import loader from "../../assets/loader.gif";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { Buffer } from 'buffer';

const SetAvatar = () => {
  // const api = `https://api.multiavatar.com/${genRandomNum()}?apikey=${process.env.VITE_AVATAR_KEY}`;

  const api = `https://api.multiavatar.com`;

  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: "dark",
  };

  //if there is no user in local storage navigate to login page
  useEffect(() => {
    const checkUser = async () => {
      const user = localStorage.getItem("chat-app-user");
      if (!user)
        navigate("/");
    };
    checkUser();
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an Avatar", toastOptions);
    }
    else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      //this chat-app-user is a key ehich we used in login page as well
      const { data } = await axios.put(`/api/user/setAvatar/${user._id}`, {
        image: avatars[selectedAvatar]
      });
      
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.pic = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate('/chat')
      }
      else {
        toast.error("Error setting avatar. Please try again", toastOptions);
      }
    }
   };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(`${api}/${Math.round(Math.random() * 1000000)}`);
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchAvatars();
  }, []);

  const skipSetting = async () => {
    navigate("/chat");
  }
  
  
  return (
    isLoading ?<Container>
      <img src={loader} alt="loader" className='loader' />
    </Container> : (

    <Container>
      <div className="title">
        <h1>Pick an avatar as your profile picture</h1>
      </div>
      <div className="avatars">
        {avatars.map((avatar, index) => (
          <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
            <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
          </div>
        ))
        }
      </div>
      <button className='submitBtn' onClick={setProfilePicture}>Set as Profile Picture</button>
      <button className='submitBtn' onClick={skipSetting}>SKIP</button>
      
    </Container>
)
)
}

const Container = styled.div`
  display: flex;    background-size: cover;

  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #2B3A67;
  // 8d6b94  827191 aa78a6 646e78 7d6b91
  // background-color: #1e1e2f; /* A complementary dark color */
  // background-image: linear-gradient(45deg, #1e1e2f 25%, #27293d 75%);
  // background-size: cover;

//   Navy Blue: #001f3f
// Midnight Blue: #191970
// Indigo: #4B0082
// Royal Blue: #2B3A67

  height:100vh;
  width:100vw;
  .loader {
      max-inline-size: 100%;
  }
  .title {
      h1 {
          color: white;
          font-size:2rem;
          font-weight:bold;
      }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding:0.4rem;
      border-radius:5rem;
      display:flex;
      justify-content:center;
      align-items:center;
      transition:0.5s ease-in-out;
      img {
          height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submitBtn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
        background-color: #4e0eff;
    }
  }
`;

export default SetAvatar