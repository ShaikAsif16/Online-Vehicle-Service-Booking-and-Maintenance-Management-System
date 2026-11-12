import api from './api';

export const paymentService = {
  processSimulatedPayment: async (paymentData) => {
    const response = await api.post('/payments/process-simulated', paymentData);
    return response.data;
  },
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
};
