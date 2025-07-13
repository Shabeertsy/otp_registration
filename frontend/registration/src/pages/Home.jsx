import React from 'react';
import './Home.css';

export default function Home() {
  const username = localStorage.getItem('username');

  return (
    <div className="home-container">
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Welcome back, {username}!</h1>
          <p>Here's what's happening today.</p>
        </header>
        
        <div className="dashboard-content">
          <div className="welcome-card">
            <h2>Getting Started</h2>
            <p>We're glad to have you here. Start exploring your dashboard.</p>
            <div className="welcome-illustration">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="#e1f0fa" />
                <path d="M60 100 Q100 40 140 100" stroke="#3498db" strokeWidth="8" fill="none" />
                <circle cx="80" cy="80" r="10" fill="#3498db" />
                <circle cx="120" cy="80" r="10" fill="#3498db" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}