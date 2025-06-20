import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Users, UserPlus, Settings, Search, Phone,
  Video, MoreVertical, Smile, Paperclip, X, Menu
} from 'lucide-react';
import './dash.css';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatApp = () => {
  const { token } = useParams();
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch profile and user list
  useEffect(() => {
    fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setCurrentUser)
      .catch(err => console.error('Profile fetch failed', err));

    fetch('http://localhost:5000/api/auth/users')
      .then(res => res.json())
      .then(setAllUsers)
      .catch(err => console.error('Users fetch failed', err));
  }, [token]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat && currentUser) {
      fetch(`http://localhost:5000/api/chat/${currentUser.id}/${selectedChat.id}`)
        .then(res => res.json())
        .then(setMessages)
        .catch(err => console.error('Message fetch failed', err));
    }
  }, [selectedChat, currentUser]);

useEffect(() => {
  if (!currentUser) return;

  socket.emit('join', currentUser.id);
  console.log('🟢 Joined socket as:', currentUser.id);

  socket.on('onlineUsers', (onlineUserIds) => {
    console.log('🟢 Online users from server:', onlineUserIds);
    const online = allUsers.filter(u => onlineUserIds.includes(u.id));
    setOnlineUsers(online);
  });

  socket.on('receiveMessage', (msg) => {
    if (
      (msg.senderId === selectedChat?.id && msg.receiverId === currentUser.id) ||
      (msg.receiverId === selectedChat?.id && msg.senderId === currentUser.id)
    ) {
      setMessages(prev => [...prev, {
        ...msg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now().toString()
      }]);
    }
  });

  return () => {
    socket.off('receiveMessage');
    socket.off('onlineUsers');
  };
}, [currentUser, selectedChat, allUsers]);



  useEffect(() => {
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
    return () => window.removeEventListener('resize', () => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
  if (!message.trim() || !selectedChat || !currentUser) return;

  const newMsg = {
    senderId: currentUser.id,
    receiverId: selectedChat.id,
    content: message.trim()
  };

  // Emit via socket
  socket.emit('sendMessage', newMsg);

  // Save to DB
  fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMsg)
  });

  // Update UI
  setMessages(prev => [...prev, {
    ...newMsg,
    sender: currentUser.fullName,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    id: Date.now().toString()
  }]);

  setMessage('');
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (user) => {
    setSelectedChat(user);
    if (windowWidth <= 768) setIsSidebarOpen(false);
  };

  const renderMessage = (msg) => {
    const isOwn = msg.senderId === currentUser?.id;
    return (
      <div key={msg.id} className={`message ${isOwn ? 'own' : ''}`}>
        {!isOwn && <div className="message-avatar">{msg.sender?.[0]}</div>}
        <div className="message-content">
          <div className={`message-bubble ${isOwn ? 'own' : ''}`}>{msg.content}</div>
          <div className={`message-info ${isOwn ? 'own' : ''}`}>
            <span>{msg.timestamp}</span>{isOwn && <span>✓✓</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-app">
      {windowWidth <= 768 && (
        <>
          <button className="hamburger-menu" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          {isSidebarOpen && <div className="sidebar-overlay active" onClick={() => setIsSidebarOpen(false)} />}
        </>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="avatar">{currentUser?.fullName?.[0]}</div>
            <div>
              <div className="user-name">{currentUser?.fullName}</div>
              <div className="user-status">Online</div>
            </div>
          </div>
          <div className="chat-actions">
            <button className="action-button" onClick={() => {}}>
              <UserPlus size={18} />
            </button>
            <button className="action-button">
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="search-bar">
          <input className="search-input" type="text" placeholder="Search users..." />
        </div>

        <div className="chat-list">
          {allUsers.filter(u => u.id !== currentUser?.id).map(user => (
            <div
              key={user.id}
              className={`chat-item ${selectedChat?.id === user.id ? 'active' : ''}`}
              onClick={() => handleChatSelect(user)}
            >
              <div className="avatar">{user.avatar || user.fullName[0]}</div>
              <div className="chat-item-content">
                <div className="chat-name">{user.fullName}</div>
              </div>
<div
  className="status-dot"
  style={{ backgroundColor: onlineUsers.some(u => u.id === user.id) ? '#25d366' : '#ccc' }}
></div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="main-chat">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="avatar">{selectedChat.avatar || selectedChat.fullName[0]}</div>
                <div className="chat-header-info">
                  <h3 className="chat-title">{selectedChat.fullName}</h3>
                  <div className="chat-status">
{onlineUsers.some(user => user.id === selectedChat?.id) ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              <div className="chat-actions">
                <Phone size={18} />
                <Video size={18} />
                <Search size={18} />
                <MoreVertical size={18} />
              </div>
            </div>

            <div className="messages-container">
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
              <button className="action-button"><Paperclip size={18} /></button>
              <div className="input-container">
                <textarea
                  className="text-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                />
                <button className="action-button"><Smile size={18} /></button>
              </div>
              <button className="send-button" onClick={handleSendMessage} disabled={!message.trim()}>
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Users size={64} />
            <h3>Select a user to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
