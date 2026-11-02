import React, { useState } from 'react';
import './App.css';

const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const randomUser = user_list[Math.floor(Math.random() * user_list.length)];
    const newMessage = {
      id: Date.now(),
      user: randomUser,
      text: inputValue,
      likes: 0
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const handleLike = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
    ));
  };

  return (
    <div className="chat-container">
      <div className="message-thread">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <span className="user-name">{msg.user}: </span>
            <span className="message-text">{msg.text}</span>
            <button className="like-btn" onClick={() => handleLike(msg.id)}>
              👍 {msg.likes}
            </button>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type Message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;