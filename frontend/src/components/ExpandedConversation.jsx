import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BsFillChatLeftTextFill, BsSend } from 'react-icons/bs';
import DarkModeToggle from './DarkModeToggle';
import LogoutButton from './authentication/LogoutButton';
import TopBar from './TopBar';
import 'react-loader-spinner';
import { Circles } from 'react-loader-spinner';

const ExpandedConversation = (props) => {
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { convo_id } = useParams();
  const [activeTab, setActiveTab] = useState('conversations');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/get-conversation', {
          params: {
            convo_id: convo_id
          }
        });
        console.log(response);
        setConversation(response.data);
        setMessages(response.data.messages)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => {
        clearInterval(interval);
    };
  }, [convo_id]);
  

  const handleSendMessage = async () => {
    axios.post(`http://127.0.0.1:8000/api/conversations/${convo_id}/add_message/`, {
        content: message,
        sender: "user",
      })
      .then(response => {
        console.log('Message added successfully:', response.data);
      })
      .catch(error => {
        console.error('Error adding message:', error);
      });
    const query = message;
    setLoading(true);
    const response = await axios.post('http://127.0.0.1:8000/api/OPAIInference/', {query, convo_id});
    const response_payload = response.data["response-payload"]
    await axios.post(`http://127.0.0.1:8000/api/conversations/${convo_id}/add_message/`, {
        content: response_payload,
        sender: "assistant",
      })
      .then(response => {
        console.log('Message added successfully:', response.data);
        setTimeout(()=> setLoading(false), 3000);
        
      })
      .catch(error => {
        console.error('Error adding message:', error);
      });
  };

  return (
    <div className="flex h-full bg-[#FAF9F6] dark:bg-slate-800 text-black dark:text-slate-300">
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
            onClick={() => nav(`/aidr`)}
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
      <div className="flex bg-gradient-to-b from-[#FAF9F6] to-slate-500 dark:bg-gradient-to-b dark:from-[#273d4f] dark:to-slate-900 dark:text-white min-h-screen dark:transition-colors dark:duration-300 transition-colors duration-300 ease-in-out dark:ease-in-out mt-0 w-full">
        <div className="flex-1 flex flex-col relative h-full max-h-screen">
          <div className="p-4 overflow-y-auto sticky mt-24 w-full inline-grid grid-flow-row">
            {/* Conversation Area */}
            {messages &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 border rounded-lg p-4 h-auto w-max max-w-[100vh] ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-black text-white dark:text-black dark:bg-slate-300'
                      : 'mr-auto bg-slate-100 dark:bg-slate-900'
                  }`}
                >
                  {msg.sender === 'assistant' && index === messages.length - 1 ? (
                    <>
                      {loading ? (
                        <Circles color="#00BFFF" height={80} width={80} />
                      ) : (
                        msg.content
                      )}
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
              ))}
          </div>
          <div className="p-4 flex items-center bg-[#FAF9F6] dark:bg-slate-800 absolute w-full dark:text-black">
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



