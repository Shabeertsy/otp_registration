import React, { useState } from 'react';
import axios from 'axios';
import './Registration.css';
import { Link, useNavigate } from 'react-router-dom';



export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      alert(response.data.message);
      setOtpSent(true);
      setPhone(formData.phone);
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message || 'Registration failed.');
      } else {
        alert('An error occurred.');
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/verify-otp/', {
        phone: phone,
        otp: otp
      });

     navigate('/login');
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message || 'OTP verification failed.');
      } else {
        alert('An error occurred.');
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/resend-otp/', {
        phone: phone,
      });

      alert('OTP resent!');
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.message || 'Failed to resend OTP.');
      } else {
        alert('An error occurred.');
      }
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="registration-title">Create Your Account</h2>

        {!otpSent ? (
          <form onSubmit={handleRegister} className="registration-form">
            <div className="form-group dual-inputs">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder='must be real indian phone number'
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="register-btn">
              Register Now
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="otp-form">
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="verify-btn">
              Verify OTP
            </button>

            <button type="button" onClick={handleResendOtp} className="resend-btn">
              Resend OTP
            </button>
          </form>
        )}

        <div className="login-link">
          Already have an account? <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
