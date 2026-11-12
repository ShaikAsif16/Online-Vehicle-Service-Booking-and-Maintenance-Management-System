import api from './api';

export const analyticsService = {
  getAdminDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
};

export const userService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  toggleUserStatus: async (id) => {
    const response = await api.put(`/users/${id}/status`);
    return response.data;
  },
};
