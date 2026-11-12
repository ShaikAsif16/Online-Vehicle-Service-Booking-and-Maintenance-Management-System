import api from './api';

export const vehicleService = {
  getMyVehicles: async () => {
    const response = await api.get('/vehicles/my');
    return response.data;
  },
  addVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },
  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
  getAllVehicles: async (params = {}) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },
};
