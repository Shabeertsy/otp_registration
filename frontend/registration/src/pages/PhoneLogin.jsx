import React, { useState } from 'react';
import './PhoneLogin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export default function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const sendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/api/resend-otp/', {
        phone: phone
      });

      alert(response.data.message || 'OTP sent!');
      setShowOtpField(true);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    await sendOtp();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      alert('Please enter the 4-digit OTP.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/api/verify-otp/', {
        phone: phone,
        otp: otp,
        by_phone: true,
      });

     
      if (response.data) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('username', response.data.username);
        navigate('/home');

      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (phone.length !== 10) {
      alert('Please enter your phone number again.');
      return;
    }
    await sendOtp();
  };

  return (
    <div className="phone-login-container">
      <div className="phone-login-card">
        <h2 className="phone-login-title">Phone Number Login</h2>
        
        {!showOtpField ? (
          <form onSubmit={handlePhoneSubmit} className="phone-form">
            <div className="form-group">
              <label htmlFor="phone">Enter Your Phone Number</label>
              <div className="phone-input-group">
                <select className="country-code">
                  <option>+91</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="otp-form">
            <div className="form-group">
              <label htmlFor="otp">Enter OTP Sent to {phone}</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4-digit code"
                required
                pattern="[0-9]{4}"
                maxLength="4"
              />
              <p className="resend-otp">
                Didn't receive OTP? 
                <button 
                  type="button" 
                  className="resend-link"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </p>
            </div>
            
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
        
        <div className="back-to-options">
          <button 
            type="button" 
            className="back-btn"
            onClick={() => setShowOtpField(false)}
            disabled={!showOtpField || isLoading}
          >
             Back
          </button>
        </div>
      </div>
    </div>
  );
}
