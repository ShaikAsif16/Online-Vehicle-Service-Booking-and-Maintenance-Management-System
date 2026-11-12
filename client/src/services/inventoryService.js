import api from './api';

export const inventoryService = {
  getInventoryParts: async (params = {}) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },
  addPart: async (partData) => {
    const response = await api.post('/inventory', partData);
    return response.data;
  },
  updatePart: async (id, partData) => {
    const response = await api.put(`/inventory/${id}`, partData);
    return response.data;
  },
  deletePart: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
};
