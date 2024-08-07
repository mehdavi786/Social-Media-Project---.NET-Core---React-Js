import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Newsfeed from './components/Newsfeed.jsx';
import Profile from './components/Profile.jsx';
import FindFriends from './components/FindFriends.jsx';
import FriendsPage from './components/FriendsPage.jsx';
import ChatInterface from './components/Chat/ChatInterface.jsx';
import Settings from './components/Settings.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/" element={ <Login /> } />
                    <Route path="/register" element={ <Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/newsfeed" element={<Newsfeed />} />
                    <Route path="/findFriends" element={<FriendsPage />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    <Route path="/settings" element={<Settings />} />

                </Routes>
            </Router>
  </React.StrictMode>,
)
