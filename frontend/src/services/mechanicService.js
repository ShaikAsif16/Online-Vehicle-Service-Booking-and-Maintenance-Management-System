import api from './api';

export const mechanicService = {
  getAllMechanics: async () => {
    const response = await api.get('/mechanics');
    return response.data;
  },
  createMechanic: async (mechanicData) => {
    const response = await api.post('/mechanics', mechanicData);
    return response.data;
  },
  updateMechanic: async (id, mechanicData) => {
    const response = await api.put(`/mechanics/${id}`, mechanicData);
    return response.data;
  },
  getMyMechanicProfile: async () => {
    const response = await api.get('/mechanics/my-profile');
    return response.data;
  },
};
