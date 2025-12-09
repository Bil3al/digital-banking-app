import React, { useState, useEffect } from 'react';
import { accountService, customerService } from '../services/api';
import './Accounts.css';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [accountType, setAccountType] = useState('CURRENT');
  const [formData, setFormData] = useState({
    customerId: '',
    initialBalance: '',
    overDraft: '',
    interestRate: '',
  });

  useEffect(() => {
    loadAccounts();
    loadCustomers();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await accountService.getAll();
      setAccounts(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load accounts. Make sure the backend is running on port 8085.';
      setError(errorMessage);
      console.error('Error loading accounts:', err);
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError('Cannot connect to backend server. Please make sure the Spring Boot application is running on http://localhost:8085');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await customerService.getAll();
      setCustomers(response.data);
    } catch (err) {
      console.error('Failed to load customers', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (accountType === 'CURRENT') {
        await accountService.createCurrent(
          parseFloat(formData.initialBalance),
          parseFloat(formData.overDraft),
          parseInt(formData.customerId)
        );
      } else {
        await accountService.createSaving(
          parseFloat(formData.initialBalance),
          parseFloat(formData.interestRate),
          parseInt(formData.customerId)
        );
      }
      setSuccess('Account created successfully');
      setShowForm(false);
      setFormData({
        customerId: '',
        initialBalance: '',
        overDraft: '',
        interestRate: '',
      });
      loadAccounts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to create account: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      customerId: '',
      initialBalance: '',
      overDraft: '',
      interestRate: '',
    });
  };

  const getAccountType = (account) => {
    if (account.interestRate !== undefined) return 'Saving Account';
    if (account.overDraft !== undefined) return 'Current Account';
    return account.type || 'Unknown';
  };

  return (
    <div className="accounts-container">
      <div className="card">
        <div className="card-header">
          <h2>Bank Accounts</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Create New Account
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="account-form">
            <h3>Create New Account</h3>
            <div className="form-group">
              <label>Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="CURRENT">Current Account</option>
                <option value="SAVING">Saving Account</option>
              </select>
            </div>
            <div className="form-group">
              <label>Customer</label>
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Initial Balance</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.initialBalance}
                onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
              />
            </div>
            {accountType === 'CURRENT' ? (
              <div className="form-group">
                <label>Overdraft Limit</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.overDraft}
                  onChange={(e) => setFormData({ ...formData, overDraft: e.target.value })}
                />
              </div>
            ) : (
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                />
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Account
              </button>
              <button type="button" className="btn btn-danger" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Customer</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No accounts found
                  </td>
                </tr>
              ) : (
                accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.id}</td>
                    <td>{getAccountType(account)}</td>
                    <td className="balance-cell">{account.balance?.toFixed(2) || '0.00'}</td>
                    <td>{account.customerDTO?.name || 'N/A'}</td>
                    <td>
                      {account.createdAt
                        ? new Date(account.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Accounts;

