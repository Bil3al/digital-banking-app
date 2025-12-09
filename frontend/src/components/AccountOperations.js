import React, { useState, useEffect } from 'react';
import { accountService, operationService } from '../services/api';
import './AccountOperations.css';

const AccountOperations = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [operations, setOperations] = useState([]);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [operationType, setOperationType] = useState('CREDIT');
  const [showOperationForm, setShowOperationForm] = useState(false);
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    description: '',
    accountDestination: '',
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadAccountDetails();
      loadOperations();
    }
  }, [selectedAccount]);

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

  const loadAccountDetails = async () => {
    try {
      const response = await accountService.getById(selectedAccount);
      setAccountDetails(response.data);
    } catch (err) {
      console.error('Failed to load account details', err);
    }
  };

  const loadOperations = async () => {
    try {
      const response = await accountService.getHistory(selectedAccount);
      setOperations(response.data);
    } catch (err) {
      console.error('Failed to load operations', err);
    }
  };

  const handleOperationSubmit = async (e) => {
    e.preventDefault();
    try {
      if (operationType === 'TRANSFER') {
        await operationService.transfer({
          accountSource: formData.accountId,
          accountDestination: formData.accountDestination,
          amount: parseFloat(formData.amount),
        });
        setSuccess('Transfer completed successfully');
      } else if (operationType === 'DEBIT') {
        await operationService.debit({
          accountId: formData.accountId,
          amount: parseFloat(formData.amount),
          description: formData.description,
        });
        setSuccess('Debit operation completed successfully');
      } else {
        await operationService.credit({
          accountId: formData.accountId,
          amount: parseFloat(formData.amount),
          description: formData.description,
        });
        setSuccess('Credit operation completed successfully');
      }
      setShowOperationForm(false);
      setFormData({
        accountId: '',
        amount: '',
        description: '',
        accountDestination: '',
      });
      if (selectedAccount) {
        loadAccountDetails();
        loadOperations();
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Operation failed: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleAccountSelect = (accountId) => {
    setSelectedAccount(accountId);
    setFormData({ ...formData, accountId });
  };

  return (
    <div className="operations-container">
      <div className="card">
        <div className="card-header">
          <h2>Account Operations</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowOperationForm(true)}
          >
            New Operation
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {showOperationForm && (
          <form onSubmit={handleOperationSubmit} className="operation-form">
            <h3>Perform Operation</h3>
            <div className="form-group">
              <label>Operation Type</label>
              <select
                value={operationType}
                onChange={(e) => setOperationType(e.target.value)}
              >
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Account {operationType === 'TRANSFER' ? 'Source' : ''}</label>
              <select
                required
                value={formData.accountId}
                onChange={(e) => {
                  setFormData({ ...formData, accountId: e.target.value });
                  handleAccountSelect(e.target.value);
                }}
              >
                <option value="">Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.id} - {account.customerDTO?.name} (Balance: {account.balance?.toFixed(2) || '0.00'})
                  </option>
                ))}
              </select>
            </div>
            {operationType === 'TRANSFER' && (
              <div className="form-group">
                <label>Destination Account</label>
                <select
                  required
                  value={formData.accountDestination}
                  onChange={(e) =>
                    setFormData({ ...formData, accountDestination: e.target.value })
                  }
                >
                  <option value="">Select destination account</option>
                  {accounts
                    .filter((acc) => acc.id !== formData.accountId)
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.id} - {account.customerDTO?.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            {operationType !== 'TRANSFER' && (
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Execute {operationType}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  setShowOperationForm(false);
                  setFormData({
                    accountId: '',
                    amount: '',
                    description: '',
                    accountDestination: '',
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="account-selector">
          <label>Select Account to View History:</label>
          <select
            value={selectedAccount}
            onChange={(e) => handleAccountSelect(e.target.value)}
          >
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.id} - {account.customerDTO?.name}
              </option>
            ))}
          </select>
        </div>

        {selectedAccount && accountDetails && (
          <div className="account-info">
            <div>
              <strong>Account ID:</strong> {accountDetails.id}
            </div>
            <div>
              <strong>Customer:</strong> {accountDetails.customerDTO?.name}
            </div>
            <div className="account-balance">
              <strong>Balance:</strong> {accountDetails.balance?.toFixed(2) || '0.00'}
            </div>
          </div>
        )}

        {selectedAccount && (
          <div className="operations-list">
            <h3>Operation History</h3>
            {operations.length === 0 ? (
              <p>No operations found for this account</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((operation) => (
                    <tr key={operation.id}>
                      <td>
                        {operation.date
                          ? new Date(operation.date).toLocaleString()
                          : 'N/A'}
                      </td>
                      <td>
                        <span className={`operation-type ${operation.type}`}>
                          {operation.type}
                        </span>
                      </td>
                      <td>{operation.amount?.toFixed(2) || '0.00'}</td>
                      <td>{operation.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountOperations;

