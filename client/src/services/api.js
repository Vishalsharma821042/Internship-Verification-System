import axios from 'axios';

// ─── API Base URL ────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── Request interceptor: attach auth token ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('[API] ✅ Token attached to:', config.method?.toUpperCase(), config.url);
        }
      } catch { /* corrupted localStorage */ }
    } else {
      console.log('[API] ⚠️ No userInfo in localStorage for:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ───────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('[API] Error:', error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);

// ─── Auth API ────────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// ─── Intern API ──────────────────────────────────────────────────────────────
export const generateCode = async (data) => {
  const response = await api.post('/intern/generate', data);
  return response.data;
};

export const verifyCode = async (code) => {
  const response = await api.get(`/intern/verify/${code}`);
  return response.data;
};

export const getAllInterns = async () => {
  const response = await api.get('/intern/list');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/intern/dashboard');
  return response.data;
};

// ─── Bulk Upload API ─────────────────────────────────────────────────────────
export const bulkUploadCSV = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // IMPORTANT: Do NOT set Content-Type manually for FormData.
  // Axios auto-detects FormData and sets multipart/form-data with the correct boundary.
  // Manually setting it breaks the boundary AND can shadow the Authorization header
  // set by the request interceptor.
  const response = await api.post('/intern/upload', formData, {
    timeout: 30000,
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return response.data;
};

export const getInternById = async (id) => {
  const response = await api.get(`/intern/${id}`);
  return response.data;
};

export const updateIntern = async (id, data) => {
  const response = await api.put(`/intern/${id}`, data);
  return response.data;
};

export const deleteIntern = async (id) => {
  const response = await api.delete(`/intern/${id}`);
  return response.data;
};

export default api;
