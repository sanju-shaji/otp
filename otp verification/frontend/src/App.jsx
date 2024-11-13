import React, { useState } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Welcome from './Welcome';

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', { email });
      if (response.data.success) {
        setOtpSent(true);
        setMessage('OTP sent to your email.');
      } else {
        setMessage('Failed to send OTP');
      }
    } catch (error) {
      setMessage('Error occurred while sending OTP');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
      if (response.data.success) {
        navigate('/welcome'); // Redirect to Welcome page
      } else {
        setMessage('Invalid OTP');
      }
    } catch (error) {
      setMessage('Error occurred while verifying OTP');
    }
  };

  return (
    <div>
      <h1>OTP Verification</h1>
      <Routes>
        <Route
          path="/"
          element={
            !otpSent ? (
              <form onSubmit={handleEmailSubmit}>
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Send OTP</button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <label>Enter OTP:</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button type="submit">Verify OTP</button>
              </form>
            )
          }
        />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
