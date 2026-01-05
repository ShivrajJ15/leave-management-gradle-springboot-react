import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

const refreshToken = (refreshToken) => {
  return axios.post(`${API_URL}/refresh`, { refreshToken });
};

const getCurrentUser = () => {
  return axios.get(`${API_URL}/me`);
};

// Add logout if your backend has a logout endpoint
const logout = () => {
  return axios.post(`${API_URL}/logout`);
};

export default {
  register,
  login,
  refreshToken,
  getCurrentUser,
  logout
};