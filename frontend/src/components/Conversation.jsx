import React from 'react';
import { Link, useNavigate  } from 'react-router-dom';

const Conversation = ({ data }) => {
  const firstMessage = data.messages.length > 0 ? data.messages[0].content : '';
  const firstResponse = data.messages.length > 1 ? data.messages[1].content : '';
  const nav = useNavigate();
  //setData(data);
  
  const handleConversationClick = async (values) => {
    const id = data.id;
    nav(`/admin/conversation/${id}`);
  }

  return (
      <div on onClick={handleConversationClick} className="bg-white p-4 rounded-md my-4 dark:bg-slate-600 hover:scale-95 hover:ease-in-out hover:duration-300 scale-100 duration-300 ease-in-out">
        <p className="text-red-500 mb-2 dark:text-blue-200">Human: mesage number 1</p>
        <p className="text-black mb-2 dark:text-blue-500">AI: message number 2</p>
      </div>
    
  );
}

export default Conversation;
