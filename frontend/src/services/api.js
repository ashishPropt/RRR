import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const booksApi = {
  getAll: (params) => api.get('/books', { params }),
  getSigned: () => api.get('/books', { params: { signed: true } }),
  getById: (id) => api.get(`/books/${id}`),
};

export const blogApi = {
  getAll: (params) => api.get('/blog', { params }),
  getRecent: (limit = 3) => api.get('/blog/recent', { params: { limit } }),
  getBySlug: (slug) => api.get(`/blog/${slug}`),
  getCategories: () => api.get('/blog/categories'),
};

export const contactApi = {
  submit: (data) => api.post('/contact', data),
};

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
};

export const auctionApi = {
  getAll: () => api.get('/auction'),
};

export const speakingApi = {
  getAll: () => api.get('/speaking'),
};

export const nonprofitApi = {
  getAll: () => api.get('/nonprofit'),
};

export const slidesApi = {
  getAll: () => api.get('/slides'),
};

export const ordersApi = {
  create: (data) => api.post('/orders', data),
};

export const adminBooksApi = {
  getAll: (token) => api.get('/admin/books', { headers: { Authorization: `Bearer ${token}` } }),
  create: (token, data) => api.post('/admin/books', data, { headers: { Authorization: `Bearer ${token}` } }),
  update: (token, id, data) => api.put(`/admin/books/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  remove: (token, id) => api.delete(`/admin/books/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};

export const adminProductsApi = {
  getAll: (token) => api.get('/admin/products', { headers: { Authorization: `Bearer ${token}` } }),
  create: (token, data) => api.post('/admin/products', data, { headers: { Authorization: `Bearer ${token}` } }),
  update: (token, id, data) => api.put(`/admin/products/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  remove: (token, id) => api.delete(`/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};

export const adminOrdersApi = {
  getAll: (token) => api.get('/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
  getById: (token, id) => api.get(`/admin/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  updateStatus: (token, id, status) => api.put(`/admin/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } }),
};

export default api;
