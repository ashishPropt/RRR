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

export default api;
