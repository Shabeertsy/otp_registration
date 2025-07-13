import React from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';



export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="landing-header">
          <h1 className="landing-title">Welcome Back</h1>
          <p className="landing-subtitle">Sign in to continue to your account</p>
        </div>

        <div className="auth-options">
          <button className="auth-btn phone-login" onClick={() => navigate('/phone-login')}>
            <svg className="auth-icon" viewBox="0 0 24 24">
              <path d="M20 15.5c-1.2 0-2.5-.2-3.6-.6h-.3c-.3 0-.5.1-.7.3l-2.2 2.2c-2.8-1.5-5.2-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.4-.5-3.6 0-.5-.5-1-1-1H4c-.5 0-1 .5-1 1 0 9.4 7.6 17 17 17 .5 0 1-.5 1-1v-3.5c0-.5-.5-1-1-1zM19 12h2c0-4.9-4-9-9-9v2c3.9 0 7 3.1 7 7zm-4 0h2c0-2.8-2.2-5-5-5v2c1.7 0 3 1.3 3 3z"/>
            </svg>
            Continue with Phone
          </button>

          <button className="auth-btn password-login" onClick={() => navigate('/login')}>
            <svg className="auth-icon" viewBox="0 0 24 24">
              <path d="M12 2C9.2 2 7 4.2 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.8-2.2-5-5-5zm0 2c1.7 0 3 1.3 3 3v3H9V7c0-1.7 1.3-3 3-3zm6 10v8H6v-8h12zm-6 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
            </svg>
            Continue with Password
          </button>
        </div>

        <div className="landing-footer">
          <p className="no-account">
            Don't have an account? <a href="/register" className="signup-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}