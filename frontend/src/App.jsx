// import { useState } from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import SetAvatar from './pages/SetAvatar';
import { ChatProvider } from './Context/ChatProvider'
import './App.css'

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/setAvatar" element={<SetAvatar />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </ChatProvider>
        <ToastContainer />
      </BrowserRouter>
    </div>
  )
}

// export default App
