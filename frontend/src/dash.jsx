import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, UserPlus, Settings, Search, Phone, Video, MoreVertical, Smile, Paperclip, X, LogOut, User, Menu } from 'lucide-react';
import './dash.css';
import { useParams } from 'react-router-dom';


const ChatApp = () => {
  const { token } = useParams();
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  const [currentUser] = useState({
    id: '1',
    name: 'John Doe',
    avatar: 'JD',
    status: 'online'
  });
  
  const messagesEndRef = useRef(null);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-close sidebar on desktop sizes
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking on overlay
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mock data
  const [chats] = useState([
    {
      id: '1',
      name: 'Alice Johnson',
      type: 'private',
      avatar: 'AJ',
      lastMessage: 'Hey, how are you doing?',
      timestamp: '2:30 PM',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Development Team',
      type: 'group',
      avatar: 'DT',
      lastMessage: 'The new feature is ready for testing',
      timestamp: '1:45 PM',
      unreadCount: 0,
      members: 5
    },
    {
      id: '3',
      name: 'Bob Wilson',
      type: 'private',
      avatar: 'BW',
      lastMessage: 'Thanks for the help!',
      timestamp: '12:15 PM',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '4',
      name: 'Sarah Davis',
      type: 'private',
      avatar: 'SD',
      lastMessage: 'See you tomorrow!',
      timestamp: '11:30 AM',
      unreadCount: 1,
      isOnline: true
    }
  ]);
  
  const [mockMessages] = useState([
    {
      id: '1',
      sender: 'Alice Johnson',
      senderId: '2',
      content: 'Hey John! How are you doing today?',
      timestamp: '2:25 PM',
      type: 'text'
    },
    {
      id: '2',
      sender: 'John Doe',
      senderId: '1',
      content: 'Hi Alice! I\'m doing great, thanks for asking. Just working on some new features.',
      timestamp: '2:26 PM',
      type: 'text'
    },
    {
      id: '3',
      sender: 'Alice Johnson',
      senderId: '2',
      content: 'That sounds exciting! What kind of features are you working on?',
      timestamp: '2:28 PM',
      type: 'text'
    },
    {
      id: '4',
      sender: 'John Doe',
      senderId: '1',
      content: 'I\'m building a real-time chat application with Socket.IO. It has rooms, private messaging, and typing indicators!',
      timestamp: '2:30 PM',
      type: 'text'
    }
  ]);
  
  useEffect(() => {
    setMessages(mockMessages);
    setOnlineUsers([
      { id: '2', name: 'Alice Johnson', avatar: 'AJ' },
      { id: '3', name: 'Bob Wilson', avatar: 'BW' },
      { id: '4', name: 'Carol Davis', avatar: 'CD' },
      { id: '5', name: 'David Miller', avatar: 'DM' },
      { id: '6', name: 'Emma Wilson', avatar: 'EW' }
    ]);
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: Date.now().toString(),
        sender: currentUser.name,
        senderId: currentUser.id,
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Close sidebar on mobile when chat is selected
    if (windowWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };
  
  const renderMessage = (msg) => {
    const isOwnMessage = msg.senderId === currentUser.id;
    
    return (
      <div
        key={msg.id}
        className={`message ${isOwnMessage ? 'own' : ''}`}
      >
        {!isOwnMessage && (
          <div className="message-avatar">
            {msg.sender.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        <div className="message-content">
          <div className={`message-bubble ${isOwnMessage ? 'own' : ''}`}>
            {msg.content}
          </div>
          <div className={`message-info ${isOwnMessage ? 'own' : ''}`}>
            <span>{msg.timestamp}</span>
            {isOwnMessage && <span>✓✓</span>}
          </div>
        </div>
      </div>
    );
  };
  
  const NewChatModal = () => (
    <div className="modal" onClick={() => setShowNewChatModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Start New Chat</h3>
          <button
            className="close-button"
            onClick={() => setShowNewChatModal(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="form-group">
          <label className="label">Search Users</label>
          <input
            className="input"
            type="text"
            placeholder="Enter username or email..."
          />
        </div>
        
        <div className="user-list">
          {onlineUsers.map(user => (
            <div
              key={user.id}
              className="user-list-item"
              onClick={() => {
                setShowNewChatModal(false);
              }}
            >
              <div className="avatar">
                {user.avatar}
              </div>
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const NewGroupModal = () => (
    <div className="modal" onClick={() => setShowNewGroupModal(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Create New Group</h3>
          <button
            className="close-button"
            onClick={() => setShowNewGroupModal(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="form-group">
          <label className="label">Group Name</label>
          <input
            className="input"
            type="text"
            placeholder="Enter group name..."
          />
        </div>
        
        <div className="form-group">
          <label className="label">Add Members</label>
          <input
            className="input"
            type="text"
            placeholder="Search users to add..."
          />
        </div>
        
        <div className="user-list">
          {onlineUsers.map(user => (
            <div
              key={user.id}
              className="user-list-item"
              onClick={() => {
                // Handle user selection for group
              }}
            >
              <div className="avatar">
                {user.avatar}
              </div>
              <span>{user.name}</span>
            </div>
          ))}
        </div>
        
        <button className="primary-button green">
          Create Group
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="chat-app">
      {/* Hamburger Menu - Mobile Only */}
      {windowWidth <= 768 && (
        <button 
          className="hamburger-menu"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar Overlay - Mobile Only */}
      {windowWidth <= 768 && (
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${windowWidth <= 768 && !isSidebarOpen ? 'mobile-hidden' : ''}`}>
        {/* Close Button - Mobile Only */}
        {windowWidth <= 768 && (
          <button 
            className="close-sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        )}

        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="avatar-container">
              <div className="avatar">
                {currentUser.avatar}
              </div>
              <div className="status-indicator"></div>
            </div>
            <div>
              <div className="user-name">{currentUser.name}</div>
              <div className="user-status">Online</div>
            </div>
          </div>
          <div className="chat-actions">
            <button className="action-button" onClick={() => setShowNewChatModal(true)}>
              <UserPlus size={18} />
            </button>
            <button className="action-button">
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search conversations..."
          />
        </div>
        
        {/* Tabs */}
        <div className="tab-container">
          <button
            className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button
            className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            Groups
          </button>
        </div>
        
        {/* Chat List */}
        <div className="chat-list">
          {chats
            .filter(chat => activeTab === 'chats' ? chat.type === 'private' : chat.type === 'group')
            .map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="avatar-container">
                  <div className="avatar">
                    {chat.avatar}
                  </div>
                  {chat.type === 'private' && chat.isOnline && (
                    <div className="status-indicator"></div>
                  )}
                </div>
                <div className="chat-item-content">
                  <div className="chat-name">{chat.name}</div>
                  <div className="last-message">{chat.lastMessage}</div>
                </div>
                <div className="chat-meta">
                  <div className="timestamp">{chat.timestamp}</div>
                  {chat.unreadCount > 0 && (
                    <div className="unread-badge">{chat.unreadCount}</div>
                  )}
                </div>
              </div>
            ))}
        </div>
        
        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            className="primary-button"
            onClick={() => setShowNewChatModal(true)}
          >
            <UserPlus size={16} />
            New Chat
          </button>
          <button
            className="primary-button green"
            onClick={() => setShowNewGroupModal(true)}
          >
            <Users size={16} />
            New Group
          </button>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="main-chat">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="avatar">
                  {selectedChat.avatar}
                </div>
                <div className="chat-header-info">
                  <h3 className="chat-title">{selectedChat.name}</h3>
                  <div className="chat-status">
                    {selectedChat.type === 'private' 
                      ? (selectedChat.isOnline ? 'Online' : 'Last seen recently')
                      : `${selectedChat.members} members`
                    }
                  </div>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-button">
                  <Phone size={18} />
                </button>
                <button className="action-button">
                  <Video size={18} />
                </button>
                <button className="action-button">
                  <Search size={18} />
                </button>
                <button className="action-button">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="messages-container">
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator">
                Alice is typing...
              </div>
            )}
            
            {/* Message Input */}
            <div className="message-input">
              <button className="action-button">
                <Paperclip size={18} />
              </button>
              <div className="input-container">
                <textarea
                  className="text-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                />
                <button className="action-button">
                  <Smile size={18} />
                </button>
              </div>
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Users size={64} />
            <h3>Select a chat to start messaging</h3>
            <p>
              Choose from your existing conversations or start a new one
            </p>
          </div>
        )}
      </div>
      
      {/* Online Users Panel - Hidden on tablets and mobile */}
      {selectedChat && windowWidth > 1024 && (
        <div className="online-users">
          <h4>
            Online Now ({onlineUsers.length})
          </h4>
          <div className="online-users-list">
            {onlineUsers.map(user => (
              <div key={user.id} className="online-user">
                <div className="avatar">
                  {user.avatar}
                </div>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Modals */}
      {showNewChatModal && <NewChatModal />}
      {showNewGroupModal && <NewGroupModal />}
    </div>
  );
};

export default ChatApp;