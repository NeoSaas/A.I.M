import React, { useState } from 'react';

function PromptArea({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-slate-600 p-4 rounded-md my-4 shadow-md mx-10 h-32">
      <textarea 
        className="border w-full p-2 rounded dark:bg-slate-600 h-full" 
        type="text" 
        placeholder="Input Prompt..." 
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default PromptArea;
