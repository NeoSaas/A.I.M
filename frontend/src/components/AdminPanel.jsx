// AdminPanel.js
import React, { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';
import PromptArea from './PromptArea';
import ConversationList from './ConversationList';
import LogoutButton from './authentication/LogoutButton';
import AnalyticsPage from './AnalyticsPage';
import TopBar from './TopBar';
import {BsFillChatLeftTextFill} from 'react-icons/bs'
import {SiGoogleanalytics} from 'react-icons/si'

function AdminPanel({setIsAuthenticated, isAuthenticated}) {
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('conversations'); 
    const [filter, setFilter] = useState('All');

    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
    };
  
    return (
      <div className='inline-flex w-screen bg-[#FAF9F6] dark:bg-slate-800 text-black dark:text-slate-300'>
        <TopBar/>
        <nav className='inline-block h-full w-max bg-inherit my-16'>
          <ul className="inline-block mx-8 space-x-1 space-y-4 mt-4 w-max">
              {/* Tab for Conversations */}
              <li
                className={`cursor-pointer ${
                  activeTab === 'conversations' ? 'my-5 py-6 hover:-translate-y-1 hover:scale-100 ease-in-out duration-300' : 'my-5 py-6 hover:-translate-y-1 hover:scale-100 ease-in-out duration-300'
                }`}
                onClick={() => setActiveTab('conversations')}
              >
                <BsFillChatLeftTextFill size={38} className='inline-flex'/>
              </li>
              {/* Tab for Analytics */}
              {/* <li
                className={`cursor-pointer ${
                  activeTab === 'analytics' ? 'text-[#234b66] my-5 py-6 hover:-translate-y-1 hover:scale-100 ease-in-out duration-300' : 'my-5 py-6 hover:-translate-y-1 hover:scale-100 ease-in-out duration-300'
                }`}
                onClick={() => setActiveTab('analytics')}
              >
                <SiGoogleanalytics size={38}/>
              </li> */}
              <li className='my-5 py-6 w-max hover:-translate-y-1 hover:scale-100 ease-in-out duration-300'>
                <DarkModeToggle/>
              </li>
              <li className='my-5 py-6'>
                <LogoutButton setIsAuthenticated={setIsAuthenticated}/>
              </li>
            </ul>
        </nav>
        <div className=" bg-gradient-to-b from-[#FAF9F6] to-slate-500 dark:bg-gradient-to-b dark:from-[#273d4f] dark:to-slate-900 dark:text-white min-h-screen dark:transition-colors dark:duration-300 transition-colors duration-300 ease-in-out dark:ease-in-out w-full">
          <h1 className="text-center text-3xl py-4">Administrator Panel</h1>
          {activeTab == 'conversations' ? (
            <>
              <PromptArea onSearch={setSearchQuery} />
              <ConversationList searchQuery={searchQuery} filter={filter}/>
               
            </>
          ):(
            <>
              <AnalyticsPage />
            </>
          )}
        </div>
      </div>
    );
  }
  
export default AdminPanel;