import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/leaves';

const applyLeave = (leaveData) => {
  return axios.post(`${API_URL}/apply`, leaveData);
};

const getMyLeaves = () => {
  return axios.get(`${API_URL}/mine`);
};

const withdrawLeave = (id) => {
  return axios.put(`${API_URL}/${id}/withdraw`);
};

const getPendingLeaves = () => {
  return axios.get(`${API_URL}/pending`);
};

const getTeamLeaves = () => {
  return axios.get(`${API_URL}/team`);
};

const approveLeave = (id) => {
  return axios.put(`${API_URL}/${id}/approve`);
};

const rejectLeave = (id) => {
  return axios.put(`${API_URL}/${id}/reject`);
};

export default {
  applyLeave,
  getMyLeaves,
  withdrawLeave,
  getPendingLeaves,
  getTeamLeaves,
  approveLeave,
  rejectLeave
};