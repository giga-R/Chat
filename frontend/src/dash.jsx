import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, UserPlus, Settings, Search, Phone, Video, MoreVertical, Smile, Paperclip, X, LogOut, User } from 'lucide-react';

// Styles object (in a real app, this would be imported from a separate CSS file)
const styles = {
  chatApp: {
    display: 'flex',
    height: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f5f7fa',
    overflow: 'hidden'
  },
  
  sidebar: {
    width: '320px',
    backgroundColor: '#2c3e50',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #34495e'
  },
  
  sidebarHeader: {
    padding: '20px',
    backgroundColor: '#34495e',
    borderBottom: '1px solid #2c3e50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#2ecc71',
    border: '2px solid white',
    position: 'absolute',
    bottom: '0',
    right: '0'
  },
  
  searchBar: {
    padding: '15px 20px',
    borderBottom: '1px solid #34495e'
  },
  
  searchInput: {
    width: '100%',
    padding: '10px 15px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#34495e',
    color: 'white',
    outline: 'none',
    fontSize: '14px'
  },
  
  tabContainer: {
    display: 'flex',
    backgroundColor: '#34495e',
    borderBottom: '1px solid #2c3e50'
  },
  
  tab: {
    flex: 1,
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#bdc3c7'
  },
  
  activeTab: {
    backgroundColor: '#2c3e50',
    color: 'white',
    borderBottom: '3px solid #3498db'
  },
  
  chatList: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px 0'
  },
  
  chatItem: {
    padding: '15px 20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  activeChatItem: {
    backgroundColor: '#34495e'
  },
  
  chatItemContent: {
    flex: 1,
    minWidth: 0
  },
  
  chatName: {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  
  lastMessage: {
    fontSize: '12px',
    color: '#bdc3c7',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  
  chatMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  
  timestamp: {
    fontSize: '11px',
    color: '#95a5a6'
  },
  
  unreadBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center'
  },
  
  mainChat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  
  chatHeader: {
    padding: '20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #ecf0f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  
  chatHeaderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  
  chatTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0
  },
  
  chatStatus: {
    fontSize: '12px',
    color: '#7f8c8d'
  },
  
  chatActions: {
    display: 'flex',
    gap: '15px'
  },
  
  actionButton: {
    padding: '8px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#7f8c8d',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#f8f9fa'
  },
  
  message: {
    marginBottom: '15px',
    display: 'flex',
    gap: '10px'
  },
  
  ownMessage: {
    flexDirection: 'row-reverse'
  },
  
  messageAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 0
  },
  
  messageContent: {
    maxWidth: '70%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  
  messageBubble: {
    padding: '12px 16px',
    borderRadius: '18px',
    backgroundColor: 'white',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    fontSize: '14px',
    lineHeight: '1.4',
    wordWrap: 'break-word'
  },
  
  ownMessageBubble: {
    backgroundColor: '#3498db',
    color: 'white'
  },
  
  messageInfo: {
    fontSize: '11px',
    color: '#95a5a6',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  
  typingIndicator: {
    padding: '15px 20px',
    backgroundColor: '#ecf0f1',
    fontSize: '13px',
    color: '#7f8c8d',
    fontStyle: 'italic',
    borderTop: '1px solid #d5dbdb'
  },
  
  messageInput: {
    padding: '20px',
    backgroundColor: 'white',
    borderTop: '1px solid #ecf0f1',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  
  inputContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '25px',
    padding: '12px 20px',
    gap: '10px'
  },
  
  textInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    color: '#2c3e50',
    resize: 'none',
    minHeight: '20px',
    maxHeight: '100px'
  },
  
  sendButton: {
    padding: '12px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  onlineUsers: {
    padding: '20px',
    backgroundColor: 'white'
  },
  
  onlineUsersList: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  
  onlineUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#2c3e50'
  },
  
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '400px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #ecf0f1'
  },
  
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0
  },
  
  closeButton: {
    padding: '5px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: '#95a5a6',
    borderRadius: '50%'
  },
  
  formGroup: {
    marginBottom: '20px'
  },
  
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2c3e50'
  },
  
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #d5dbdb',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#2c3e50',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box'
  },
  
  primaryButton: {
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  
  userList: {
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #ecf0f1',
    borderRadius: '8px',
    marginTop: '10px'
  },
  
  userListItem: {
    padding: '12px 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    borderBottom: '1px solid #ecf0f1'
  },
  
  selectedUser: {
    backgroundColor: '#e3f2fd'
  }
};

const ChatApp = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUser] = useState({
    id: '1',
    name: 'John Doe',
    avatar: 'JD',
    status: 'online'
  });
  
  const messagesEndRef = useRef(null);
  
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
      { id: '4', name: 'Carol Davis', avatar: 'CD' }
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
  
  const renderMessage = (msg) => {
    const isOwnMessage = msg.senderId === currentUser.id;
    
    return (
      <div
        key={msg.id}
        style={{
          ...styles.message,
          ...(isOwnMessage ? styles.ownMessage : {})
        }}
      >
        {!isOwnMessage && (
          <div style={styles.messageAvatar}>
            {msg.sender.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        <div style={styles.messageContent}>
          <div
            style={{
              ...styles.messageBubble,
              ...(isOwnMessage ? styles.ownMessageBubble : {})
            }}
          >
            {msg.content}
          </div>
          <div style={{
            ...styles.messageInfo,
            ...(isOwnMessage ? { alignSelf: 'flex-end' } : {})
          }}>
            <span>{msg.timestamp}</span>
            {isOwnMessage && <span>✓✓</span>}
          </div>
        </div>
      </div>
    );
  };
  
  const NewChatModal = () => (
    <div style={styles.modal} onClick={() => setShowNewChatModal(false)}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Start New Chat</h3>
          <button
            style={styles.closeButton}
            onClick={() => setShowNewChatModal(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Search Users</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter username or email..."
          />
        </div>
        
        <div style={styles.userList}>
          {onlineUsers.map(user => (
            <div
              key={user.id}
              style={styles.userListItem}
              onClick={() => {
                // Handle user selection
                setShowNewChatModal(false);
              }}
            >
              <div style={{...styles.avatar, width: '32px', height: '32px', fontSize: '12px'}}>
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
    <div style={styles.modal} onClick={() => setShowNewGroupModal(false)}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Create New Group</h3>
          <button
            style={styles.closeButton}
            onClick={() => setShowNewGroupModal(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Group Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter group name..."
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Add Members</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Search users to add..."
          />
        </div>
        
        <div style={styles.userList}>
          {onlineUsers.map(user => (
            <div
              key={user.id}
              style={styles.userListItem}
              onClick={() => {
                // Handle user selection for group
              }}
            >
              <div style={{...styles.avatar, width: '32px', height: '32px', fontSize: '12px'}}>
                {user.avatar}
              </div>
              <span>{user.name}</span>
            </div>
          ))}
        </div>
        
        <button style={styles.primaryButton}>
          Create Group
        </button>
      </div>
    </div>
  );
  
  return (
    <div style={styles.chatApp}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Sidebar Header */}
        <div style={styles.sidebarHeader}>
          <div style={styles.userProfile}>
            <div style={{position: 'relative'}}>
              <div style={styles.avatar}>
                {currentUser.avatar}
              </div>
              <div style={styles.statusIndicator}></div>
            </div>
            <div>
              <div style={{fontWeight: '600', fontSize: '14px'}}>{currentUser.name}</div>
              <div style={{fontSize: '12px', color: '#bdc3c7'}}>Online</div>
            </div>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <button style={styles.actionButton} onClick={() => setShowNewChatModal(true)}>
              <UserPlus size={18} />
            </button>
            <button style={styles.actionButton}>
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div style={styles.searchBar}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search conversations..."
          />
        </div>
        
        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'chats' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'groups' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('groups')}
          >
            Groups
          </button>
        </div>
        
        {/* Chat List */}
        <div style={styles.chatList}>
          {chats
            .filter(chat => activeTab === 'chats' ? chat.type === 'private' : chat.type === 'group')
            .map(chat => (
              <div
                key={chat.id}
                style={{
                  ...styles.chatItem,
                  ...(selectedChat?.id === chat.id ? styles.activeChatItem : {}),
                  ':hover': { backgroundColor: '#34495e' }
                }}
                onClick={() => setSelectedChat(chat)}
              >
                <div style={{position: 'relative'}}>
                  <div style={styles.avatar}>
                    {chat.avatar}
                  </div>
                  {chat.type === 'private' && chat.isOnline && (
                    <div style={styles.statusIndicator}></div>
                  )}
                </div>
                <div style={styles.chatItemContent}>
                  <div style={styles.chatName}>{chat.name}</div>
                  <div style={styles.lastMessage}>{chat.lastMessage}</div>
                </div>
                <div style={styles.chatMeta}>
                  <div style={styles.timestamp}>{chat.timestamp}</div>
                  {chat.unreadCount > 0 && (
                    <div style={styles.unreadBadge}>{chat.unreadCount}</div>
                  )}
                </div>
              </div>
            ))}
        </div>
        
        {/* Quick Actions */}
        <div style={{padding: '15px 20px', borderTop: '1px solid #34495e'}}>
          <button
            style={{
              ...styles.primaryButton,
              backgroundColor: '#3498db',
              marginBottom: '10px'
            }}
            onClick={() => setShowNewChatModal(true)}
          >
            <UserPlus size={16} style={{marginRight: '8px'}} />
            New Chat
          </button>
          <button
            style={{
              ...styles.primaryButton,
              backgroundColor: '#27ae60'
            }}
            onClick={() => setShowNewGroupModal(true)}
          >
            <Users size={16} style={{marginRight: '8px'}} />
            New Group
          </button>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div style={styles.mainChat}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderLeft}>
                <div style={styles.avatar}>
                  {selectedChat.avatar}
                </div>
                <div style={styles.chatHeaderInfo}>
                  <h3 style={styles.chatTitle}>{selectedChat.name}</h3>
                  <div style={styles.chatStatus}>
                    {selectedChat.type === 'private' 
                      ? (selectedChat.isOnline ? 'Online' : 'Last seen recently')
                      : `${selectedChat.members} members`
                    }
                  </div>
                </div>
              </div>
              <div style={styles.chatActions}>
                <button style={styles.actionButton}>
                  <Phone size={18} />
                </button>
                <button style={styles.actionButton}>
                  <Video size={18} />
                </button>
                <button style={styles.actionButton}>
                  <Search size={18} />
                </button>
                <button style={styles.actionButton}>
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div style={styles.messagesContainer}>
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Typing Indicator */}
            {isTyping && (
              <div style={styles.typingIndicator}>
                Alice is typing...
              </div>
            )}
            
            {/* Message Input */}
            <div style={styles.messageInput}>
              <button style={styles.actionButton}>
                <Paperclip size={18} />
              </button>
              <div style={styles.inputContainer}>
                <textarea
                  style={styles.textInput}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                />
                <button style={styles.actionButton}>
                  <Smile size={18} />
                </button>
              </div>
              <button
                style={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#7f8c8d',
            fontSize: '18px'
          }}>
            <Users size={64} style={{marginBottom: '20px', opacity: 0.5}} />
            <h3>Select a chat to start messaging</h3>
            <p style={{fontSize: '14px', textAlign: 'center', maxWidth: '300px'}}>
              Choose from your existing conversations or start a new one
            </p>
          </div>
        )}
      </div>
      
      {/* Online Users Panel */}
      {selectedChat && (
        <div style={{...styles.onlineUsers, width: '250px', borderLeft: '1px solid #ecf0f1'}}>
          <h4 style={{margin: '0 0 15px 0', fontSize: '16px', color: '#2c3e50'}}>
            Online Now ({onlineUsers.length})
          </h4>
          <div style={styles.onlineUsersList}>
            {onlineUsers.map(user => (
              <div key={user.id} style={styles.onlineUser}>
                <div style={{...styles.avatar, width: '24px', height: '24px', fontSize: '10px'}}>
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