import api from './api';

export const bookingService = {
  getAvailableSlots: async (date) => {
    const response = await api.get('/bookings/available-slots', { params: { date } });
    return response.data;
  },
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getMyBookings: async (params = {}) => {
    const response = await api.get('/bookings/my', { params });
    return response.data;
  },
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  cancelBooking: async (id, reason) => {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },
  getAllBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },
  updateBookingApproval: async (id, action, reason) => {
    const response = await api.put(`/bookings/${id}/approval`, { action, reason });
    return response.data;
  },
  assignMechanic: async (id, mechanicId) => {
    const response = await api.put(`/bookings/${id}/assign-mechanic`, { mechanicId });
    return response.data;
  },
  getMechanicAssignedJobs: async (params = {}) => {
    const response = await api.get('/bookings/mechanic/assigned', { params });
    return response.data;
  },
  updateServiceProgress: async (id, progressData) => {
    const response = await api.put(`/bookings/${id}/progress`, progressData);
    return response.data;
  },
};
