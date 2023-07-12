import './App.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3030');


function App() {
  const [socketId, setSocketId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleReceivedMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
    console.log(message);
  }

  const handleInputChange = (event) => {
    setInput(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(input){
      socket.emit('chat_message', input);
      setInput('');
    }

  }

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
    });

    socket.on('received_message', handleReceivedMessage);
    console.log(messages)

    return () => {
      socket.off('received_message')
    }

  }, []);

  
  
  return (
    <div className="chat-container">
      <h3>
        <span className="title">Socket ID: </span>
        <span className="socket-id">{socketId}</span>
      </h3>
      <ul className="chat-messages">
        {messages.map((message, index) => (
            <li key={index}>
              <span className="message-sender">{message.id}</span>
              <span className="message-text">: {message.message}</span>
            </li>
        ))}
      </ul>
      <form className="chat-form" onSubmit={handleSubmit}>
          <input 
          type="text" 
          value={input}
          onChange={handleInputChange}
          />
          <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
