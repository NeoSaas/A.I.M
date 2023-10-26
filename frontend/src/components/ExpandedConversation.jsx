import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BsFillChatLeftTextFill, BsSend } from 'react-icons/bs';
import DarkModeToggle from './DarkModeToggle';
import LogoutButton from './authentication/LogoutButton';
import TopBar from './TopBar';

const ExpandedConversation = (props) => {
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState('');
  const { convo_id } = useParams();
  const [activeTab, setActiveTab] = useState('conversations');
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = axios.get('http://127.0.0.1:8000/api/get-conversation', {
          params: {
            convo_id: convo_id
          }
        });
        console.log(response);
        setConversation(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [convo_id]);

  const handleClose = async () => {
    // Handle close logic here
  };

  const handleSendMessage = async () => {
    // Handle sending the message logic here
    // You can send the message to your backend API if needed
  };

  // Extract first two messages from the conversation data
  const firstMessage = conversation.messages;
  const secondMessage = conversation.messages;
  const messageArray = Object.values(conversation.messages);
  console.log(conversation);
  console.log(convo_id);

  return (
    <div className="flex h-screen bg-[#FAF9F6] dark:bg-slate-800 text-black dark:text-slate-300">
      <TopBar />
      <nav className="inline-block h-full w-max bg-inherit my-16">
        <ul className="inline-block mx-8 space-x-1 space-y-4 mt-4 w-max">
          {/* Tab for Conversations */}
          <li
            className={`cursor-pointer ${
              activeTab === 'conversations'
                ? 'my-5 py-6 hover:-translate-y-1 hover:scale-100 ease-in-out duration-300'
                : 'my-5 py-6 hover:-translate-y-1 hover:scale-100 ease-in-out duration-300'
            }`}
            onClick={() => nav(`/admin`)}
          >
            <BsFillChatLeftTextFill size={38} className="inline-flex" />
          </li>
          <li className="my-5 py-6 w-max hover:-translate-y-1 hover:scale-100 ease-in-out duration-300">
            <DarkModeToggle />
          </li>
          <li className="my-5 py-6">
            <LogoutButton setIsAuthenticated={props.setIsAuthenticated} />
          </li>
        </ul>
      </nav>
      <div className="flex flex-col flex-1 bg-gradient-to-b from-[#FAF9F6] to-slate-500 dark:bg-gradient-to-b dark:from-[#273d4f] dark:to-slate-900 dark:text-white min-h-screen dark:transition-colors dark:duration-300 transition-colors duration-300 ease-in-out dark:ease-in-out mt-8">
        <div className="flex-1 flex flex-col relative">
          <div className="p-4 overflow-y-auto">
            {/* Display the first two messages of the conversation */}
            <div className="mb-2 text-left">{firstMessage}</div>
            <div className="mb-2 text-left">{secondMessage}</div>
            {/* Conversation Area */}
            {messageArray.slice(2).map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="p-4 flex items-center bg-gray-200 dark:bg-gray-700">
            {/* Input Area */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 mr-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center h-auto p-4 rounded-lg relative bg-black dark:bg-slate-300 hover:scale-105 hover:transform hover:duration-300 transform duration-300 text-white dark:text-black text-xs"
            >
              <BsSend className="mr-2" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedConversation;



