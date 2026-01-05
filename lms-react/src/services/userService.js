import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/users';

const getMyTeam = () => {
  return axios.get(`${API_URL}/my-team`);
};



const getAllUsers = () => {
  return axios.get(API_URL);
};

const changeManager = (userId, managerId) => {
  return axios.put(`${API_URL}/${userId}/manager`, { managerId });
};

const adjustLeaveBalance = (userId, leaveType, adjustment) => {
  return axios.put(`${API_URL}/${userId}/adjust-leave-balance`, {
    type: leaveType,
    adjustment
  });
};

export default {
  getMyTeam,
  getAllUsers,
  changeManager,
  adjustLeaveBalance
};