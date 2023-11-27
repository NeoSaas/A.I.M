import React, { useState } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './components/authentication/LoginScreen';
import AdminPanel from './components/AdminPanel';
import './index.css';
import ExpandedConversation from './components/ExpandedConversation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Login setIsAuthenticated={setIsAuthenticated}/>} /> 
          {
            isAuthenticated ? 
              [
                <>
                  <Route path="/aidr" element={<AdminPanel setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>}/>  
                  <Route path="/aidr/conversation/:convo_id" element={<ExpandedConversation setIsAuthenticated={setIsAuthenticated}/>}/>
                </>
              ]
              :
              null
          }
          <Route path={"*"} element={ <Login setIsAuthenticated={setIsAuthenticated}/>}/>
          {/* <ProtectedRoute path="/aidr" element={<AdminPanel/>} isAuthenticated={isAuthenticated}/> */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
