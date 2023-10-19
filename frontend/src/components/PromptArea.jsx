import axios from 'axios';
import React, { useState } from 'react';
import { BsSend } from 'react-icons/bs';

function PromptArea({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySend = () => {
    //axios
  };

  return (
    <div className="bg-white dark:bg-slate-600 p-4 rounded-md h-28 my-4 shadow-md mx-9 flex">
      <textarea 
        className="border w-full p-2 rounded dark:bg-slate-600 h-full" 
        type="text" 
        placeholder="Input Prompt..." 
        value={query}
        onChange={handleInputChange}
      />
      <button onClick={handleInputChange} className='bg-black dark:bg-slate-300 w-20 flex items-center justify-center h-auto p-4 rounded-lg relative hover:scale-105 hover:transform hover:duration-300 transform duration-300 text-white dark:text-black text-xs'><BsSend size={30}/></button>
    </div>
  );
}

export default PromptArea;
