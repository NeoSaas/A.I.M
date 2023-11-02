import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Conversation from './Conversation';

const ConversationList = (props) => {
    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);

    
    const fetchData = async () => {
        try {
            const response = await axios.get('http://neosaas.net/api/conversations/');
            setConversations(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 100000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (props.searchQuery) {
            const filtered = conversations.filter(convo =>
                convo.name && convo.name.toLowerCase().includes(props.searchQuery.toLowerCase())
            );
            setFilteredConversations(filtered);
        } else {
            setFilteredConversations(conversations);
        }
    }, [props.searchQuery, conversations]);

    return (
        <div className="p-4 mx-5">
            {filteredConversations.map(convo => (
                <Conversation key={convo.id} data={convo} />
            ))}
        </div>
    );
}

export default ConversationList;
