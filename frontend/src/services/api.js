import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

export const groupService = {
  createGroup: (data) => api.post('/groups', data),
  getGroups: () => api.get('/groups'),
  getGroupById: (id) => api.get(`/groups/${id}`),
  addMember: (groupId, memberId) => api.post(`/groups/${groupId}/add-member`, { memberId }),
  removeMember: (groupId, memberId) => api.post(`/groups/${groupId}/remove-member`, { memberId }),
  deleteGroup: (id) => api.delete(`/groups/${id}`)
};

export const expenseService = {
  addExpense: (data) => api.post('/expenses', data),
  getExpenses: (groupId) => api.get(`/expenses/${groupId}`),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`)
};

export const paymentService = {
  getPayments: (groupId) => api.get(`/payments/${groupId}`),
  getPendingPayments: () => api.get('/payments/pending'),
  settlePayment: (id) => api.post(`/payments/${id}/settle`)
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data)
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`)
};

export default api;
