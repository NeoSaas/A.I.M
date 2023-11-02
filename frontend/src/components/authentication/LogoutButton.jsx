import React from 'react';
import { Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {BiLogOut} from 'react-icons/bi'


function LogoutButton({ setIsAuthenticated }) {
    const nav = useNavigate();

    const handleLogout = async () => {
        try {
            const csrfToken = getCookie('csrftoken'); // get csrf
            axios.post(
                'http://neosaas.net/api/logout/',
            );
            setIsAuthenticated(false);
            nav('/');
        } catch (error) {
            console.error(error);
        }
    };

    //depracated
    const getCookie = name => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    return (

        <button onClick={handleLogout} className=" text-black dark:text-slate-300 transition ease-in-out bg-transparent hover:-translate-y-1 hover:scale-100 dark:hover:text-red-500 hover:text-red-500 duration-300 rounded-lg">
            <BiLogOut size={48}/>
        </button>
       
    );
}

export default LogoutButton;
