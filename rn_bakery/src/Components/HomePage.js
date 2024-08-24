// src/Components/HomePage.js
import React from 'react';
import './HomePage.css'; 

function HomePage() {
    return (
        <div className="home-container">
            <h1>Welcome to Our Platform!</h1>
            <p>
                Discover our innovative solutions designed to elevate your experience and meet your needs. Whether you're looking for cutting-edge technology or insightful resources, we've got you covered.
            </p>
            <p>
                Explore our <a href="/dashboard">dashboard</a> to get a comprehensive view of our offerings, or visit our <a href="/form">form page</a> to engage with our tools and services directly.
            </p>
            <p>
                Join our community and stay updated with the latest news and updates. We’re excited to have you on board!
            </p>
            <p className="call-to-action">
                Ready to get started? 
            </p>
            

            <div className='contact'>
                <p>Contact details : </p>
                <p>0775446861</p>
                <p>sasindudeshpariya098@gmail.com</p>
            </div>
            
        </div>
    );
}

export default HomePage;
