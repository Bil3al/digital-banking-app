import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export const customerService = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customer) => api.post('/customers', customer),
  update: (id, customer) => api.put(`/customers/${id}`, customer),
  delete: (id) => api.delete(`/customers/${id}`),
  search: (keyword) => api.get(`/customers/search?keyword=${keyword}`),
};

export const accountService = {
  getAll: () => api.get('/accounts'),
  getById: (id) => api.get(`/accounts/${id}`),
  createCurrent: (initialBalance, overDraft, customerId) =>
    api.post(`/bankAccounts/currentAccount?initialBalance=${initialBalance}&overDraft=${overDraft}&customerId=${customerId}`),
  createSaving: (initialBalance, interestRate, customerId) =>
    api.post(`/bankAccounts/savingAccount?initialBalance=${initialBalance}&interestRate=${interestRate}&customerId=${customerId}`),
  getHistory: (accountId) => api.get(`/accounts/${accountId}/history`),
  getHistoryPaginated: (accountId, page, size) =>
    api.get(`/accounts/${accountId}/pageHistory?page=${page}&size=${size}`),
};

export const operationService = {
  debit: (debitDTO) => api.post('/accounts/debit', debitDTO),
  credit: (creditDTO) => api.post('/accounts/credit', creditDTO),
  transfer: (transferDTO) => api.post('/accounts/transfer', transferDTO),
};

export default api;

