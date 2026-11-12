import api from './api';

export const maintenanceService = {
  getMyMaintenanceHistory: async (params = {}) => {
    const response = await api.get('/maintenance/my', { params });
    return response.data;
  },
  getVehicleMaintenanceHistory: async (vehicleId) => {
    const response = await api.get(`/maintenance/vehicle/${vehicleId}`);
    return response.data;
  },
};
