import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Customers from './components/Customers';
import Accounts from './components/Accounts';
import AccountOperations from './components/AccountOperations';
import ConnectionTest from './components/ConnectionTest';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">E-Banking</h1>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/customers" className="nav-link">Customers</Link>
              </li>
              <li className="nav-item">
                <Link to="/accounts" className="nav-link">Accounts</Link>
              </li>
              <li className="nav-item">
                <Link to="/operations" className="nav-link">Operations</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <ConnectionTest />
          <Routes>
            <Route path="/" element={<Customers />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/operations" element={<AccountOperations />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

