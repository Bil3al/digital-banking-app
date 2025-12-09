import React, { useState, useEffect } from 'react';
import { customerService } from '../services/api';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getAll();
      setCustomers(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load customers. Make sure the backend is running on port 8085.';
      setError(errorMessage);
      console.error('Error loading customers:', err);
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError('Cannot connect to backend server. Please make sure the Spring Boot application is running on http://localhost:8085');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      loadCustomers();
      return;
    }
    try {
      setLoading(true);
      const response = await customerService.search(searchKeyword);
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to search customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, formData);
        setSuccess('Customer updated successfully');
      } else {
        await customerService.create(formData);
        setSuccess('Customer created successfully');
      }
      setShowForm(false);
      setEditingCustomer(null);
      setFormData({ name: '', email: '' });
      loadCustomers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save customer');
      console.error(err);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({ name: customer.name, email: customer.email });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.delete(id);
        setSuccess('Customer deleted successfully');
        loadCustomers();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to delete customer');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '' });
  };

  return (
    <div className="customers-container">
      <div className="card">
        <div className="card-header">
          <h2>Customers Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add New Customer
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search customers by name..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="customer-form">
            <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingCustomer ? 'Update' : 'Create'}
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
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        style={{ marginRight: '0.5rem' }}
                        onClick={() => handleEdit(customer)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </button>
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

export default Customers;

