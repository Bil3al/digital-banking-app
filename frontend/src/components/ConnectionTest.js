import React, { useState, useEffect } from 'react';
import { customerService } from '../services/api';
import './ConnectionTest.css';

const ConnectionTest = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('checking');
      setMessage('Testing connection to backend...');
      await customerService.getAll();
      setStatus('connected');
      setMessage('✓ Successfully connected to backend API');
    } catch (err) {
      setStatus('disconnected');
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setMessage('✗ Cannot connect to backend. Please make sure Spring Boot is running on http://localhost:8085');
      } else {
        setMessage(`✗ Connection error: ${err.message}`);
      }
    }
  };

  return (
    <div className={`connection-test ${status}`}>
      <div className="connection-status">
        <span className="status-indicator"></span>
        <span className="status-message">{message}</span>
        <button className="btn-test" onClick={testConnection}>
          Retry
        </button>
      </div>
    </div>
  );
};

export default ConnectionTest;

