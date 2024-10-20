import React from 'react';

import Logout from './Logout';

const Home = () => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role'); // Get the role from local storage

    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <p>Your role is: {role === '1' ? 'Admin' : role === '2' ? 'Seller' : 'Customer'}</p>
            
            <Logout />
        </div>
    );
};

export default Home;
