import api from './api';

export const invoiceService = {
  getMyInvoices: async (params = {}) => {
    const response = await api.get('/invoices/my', { params });
    return response.data;
  },
  getInvoiceById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },
  getAllInvoices: async (params = {}) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },
  updateInvoiceStatus: async (id, statusData) => {
    const response = await api.put(`/invoices/${id}/status`, statusData);
    return response.data;
  },
};
